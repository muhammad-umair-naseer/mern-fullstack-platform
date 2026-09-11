import crypto from 'crypto';
import { getDB } from '../setup/db.js';
import { getOrSet, CACHE_KEYS, CACHE_TTL, invalidateCertificate } from './cache.service.js';

/**
 * Certificate codes and issuance.
 *
 * Issued exactly once per learner per course; the unique constraint on
 * certificates(userId, courseId) is the real guarantee, this is the happy path.
 */

const makeCode = () =>
  `CTX-${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()}`;

/** Issues a certificate if the learner does not already hold one for this course. */
export const issueCertificate = ({ userId, courseId, score }) => {
  const db = getDB();
  const existing = db
    .prepare('SELECT code, score, issuedAt FROM certificates WHERE userId = ? AND courseId = ?')
    .get(userId, courseId);
  if (existing) return existing;

  const issuedAt = new Date().toISOString();
  let code = makeCode();
  // Astronomically unlikely, but a collision would be a 500 at the worst moment.
  while (db.prepare('SELECT 1 FROM certificates WHERE code = ?').get(code)) code = makeCode();

  db.prepare('INSERT INTO certificates (userId, courseId, code, score, issuedAt) VALUES (?, ?, ?, ?, ?)')
    .run(userId, courseId, code, score, issuedAt);
  db.prepare('UPDATE enrollments SET completedAt = ? WHERE userId = ? AND courseId = ?')
    .run(issuedAt, userId, courseId);

  // Invalidate any negative cache or pre-warm if needed
  invalidateCertificate(code).catch(() => {});

  return { code, score, issuedAt };
};

/** Public lookup used by the verification page with cache-aside. */
export const findCertificateByCode = async (code) => {
  if (!code) return { data: null, cached: false };
  const normalizedCode = String(code).trim().toUpperCase();

  return await getOrSet(
    CACHE_KEYS.certificate(normalizedCode),
    () => {
      const row = getDB()
        .prepare(
          `SELECT cert.code, cert.score, cert.issuedAt,
                  u.name AS learnerName,
                  c.id AS courseId, c.title AS courseTitle, c.duration, c.level, c.slug,
                  (SELECT COUNT(*) FROM chapters ch WHERE ch.courseId = c.id) AS chapterCount,
                  (SELECT COUNT(*) FROM lessons l JOIN chapters ch ON ch.id = l.chapterId
                    WHERE ch.courseId = c.id) AS lessonCount
           FROM certificates cert
           JOIN users u ON u.id = cert.userId
           JOIN courses c ON c.id = cert.courseId
           WHERE cert.code = ?`
        )
        .get(normalizedCode);
      return row || null;
    },
    CACHE_TTL.CERTIFICATE
  );
};
