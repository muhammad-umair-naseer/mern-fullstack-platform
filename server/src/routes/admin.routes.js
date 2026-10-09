import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { requireAdmin } from '../middleware/auth.js';
import { getDB, dbEngine } from '../setup/db.js';
import { redisPing, redisStats } from '../services/redis.service.js';
import { getQueueMetrics } from '../services/queue.service.js';
import { gameSsoSecret, GAME_TOKEN_ISSUER } from '../services/gameSso.js';
import { courseBySlug, computeGates, finishedLessonIds } from '../services/progress.service.js';
import { isAdminEmail } from '../setup/admin.js';
import { applyCourseOverrides, restoreCourseFromContent } from '../content/seed.js';
import { invalidateCourseCache, invalidateCertificate } from '../services/cache.service.js';

/**
 * Everything the admin portal (port 6001) reads and changes. Every route is
 * behind requireAdmin: the one account named by ADMIN_EMAIL.
 */
const router = Router();
router.use(requireAdmin);

const PAGE = 50;
const paging = (q) => {
  const page = Math.max(1, parseInt(q.page, 10) || 1);
  return { page, limit: PAGE, offset: (page - 1) * PAGE };
};
const like = (s) => `%${String(s || '').trim().replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
// Topics finished the way the learner's own progress bar counts them: read
// AND its topic quiz passed (progress.service.js), so the two never disagree.
const finishedFor = async (userId, slug) =>
  finishedLessonIds(await computeGates(userId, await courseBySlug(slug))).length;

// Every change the admin makes leaves a line in the API log.
const audit = (action, target) => console.log('[admin]', action, target);
const fail = (res, status, message) => res.status(status).json({ message });
// Path ids: digits only, so '1.5' or '0x10' is a plain 404, not a 500 or another row.
const idOf = (s) => (/^\d{1,15}$/.test(String(s)) ? Number(s) : 0);

/**
 * Reads the fields named in rules out of a request body. Strings are trimmed
 * and length-checked; a field the body leaves out is left alone. Returns
 * { values } with only the fields given, or { error } with a sentence the
 * portal can show as it is.
 */
const readFields = (body, rules) => {
  const values = {};
  for (const [key, [label, min, max]] of Object.entries(rules)) {
    const v = body?.[key];
    if (v === undefined) continue;
    if (typeof v !== 'string') return { error: `${label} must be text` };
    const t = v.trim();
    if (t.length < min || t.length > max) {
      return { error: min ? `${label} must be ${min} to ${max} characters` : `${label} can be at most ${max} characters` };
    }
    values[key] = t;
  }
  return { values };
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const certificateCodes = async (where, ...args) =>
  (await getDB().prepare(`SELECT code FROM certificates WHERE ${where}`).all(...args)).map((r) => r.code);
const forgetCertificates = (codes) => Promise.all(codes.map((code) => invalidateCertificate(code).catch(() => {})));
// The public certificate page shows the course title and level too.
const forgetCourseCertificates = async (slug) =>
  forgetCertificates(await certificateCodes('courseId = (SELECT id FROM courses WHERE slug = ?)', slug));

const wrap = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(`Admin ${req.method} ${req.path} failed:`, err);
    res.status(500).json({ message: 'Admin request failed' });
  });

// --------------------------------------------------------------- health
// The detail the public /health no longer shows.
router.get('/health', wrap(async (_req, res) => {
  const redis = await redisPing();
  const stats = await redisStats();
  res.json({
    ok: true,
    uptime: Number(process.uptime().toFixed(2)),
    database: `${dbEngine()} (connected)`,
    redis: { status: redis.status, latencyMs: redis.latencyMs, usedMemory: stats.usedMemory ?? 'n/a' },
    queue: await getQueueMetrics(),
  });
}));

// ------------------------------------------------------------- overview
router.get('/overview', wrap(async (_req, res) => {
  const db = getDB();
  const one = async (sql) => Number((await db.prepare(sql).get()).n) || 0;
  const [users, verified, enrollments, completed, certificates, internships, messagesOpen, claudePending, courses] =
    await Promise.all([
      one("SELECT COUNT(*) AS n FROM users WHERE role <> 'admin'"),
      one("SELECT COUNT(*) AS n FROM users WHERE role <> 'admin' AND emailVerified = 1"),
      one('SELECT COUNT(*) AS n FROM enrollments'),
      one('SELECT COUNT(*) AS n FROM enrollments WHERE completedAt IS NOT NULL'),
      one('SELECT COUNT(*) AS n FROM certificates'),
      one('SELECT COUNT(*) AS n FROM internship_applications'),
      one('SELECT COUNT(*) AS n FROM contact_messages WHERE handled = 0'),
      one("SELECT COUNT(*) AS n FROM claude_pro_applications WHERE status = 'applied'"),
      one('SELECT COUNT(*) AS n FROM courses'),
    ]);
  const recentUsers = await db
    .prepare("SELECT id, name, email, emailVerified, createdAt FROM users WHERE role <> 'admin' ORDER BY createdAt DESC LIMIT 6")
    .all();
  const recentCertificates = await db
    .prepare(
      `SELECT c.code, c.score, c.issuedAt, u.name AS userName, co.title AS courseTitle
         FROM certificates c JOIN users u ON u.id = c.userId JOIN courses co ON co.id = c.courseId
        ORDER BY c.issuedAt DESC LIMIT 6`
    )
    .all();
  res.json({
    data: {
      counts: { users, verified, enrollments, completed, certificates, internships, messagesOpen, claudePending, courses },
      recentUsers,
      recentCertificates,
    },
  });
}));

// -------------------------------------------------------------- courses
const LESSONS_PER_COURSE = `SELECT ch.courseId, COUNT(l.id) AS lessons
  FROM chapters ch JOIN lessons l ON l.chapterId = ch.id GROUP BY ch.courseId`;
const EDITED = 'EXISTS (SELECT 1 FROM course_overrides o WHERE o.slug = co.slug)';

const courseRow = (slug) =>
  getDB()
    .prepare(
      `SELECT co.id, co.slug, co.title, co.summary, co.description, co.category, co.level, co.duration,
              (co.hidden = 1) AS hidden, ${EDITED} AS edited, COALESCE(lc.lessons, 0) AS lessons
         FROM courses co LEFT JOIN (${LESSONS_PER_COURSE}) lc ON lc.courseId = co.id WHERE co.slug = ?`
    )
    .get(slug);

router.get('/courses', wrap(async (_req, res) => {
  const rows = await getDB()
    .prepare(
      `SELECT co.id, co.slug, co.title, co.category, co.level, co.summary, co.description, co.duration,
              (co.hidden = 1) AS hidden, ${EDITED} AS edited,
              COALESCE(lc.lessons, 0) AS lessons,
              (SELECT COUNT(*) FROM enrollments e WHERE e.courseId = co.id) AS students,
              (SELECT COUNT(*) FROM enrollments e WHERE e.courseId = co.id AND e.completedAt IS NOT NULL) AS completed,
              (SELECT COUNT(*) FROM certificates c WHERE c.courseId = co.id) AS certificates
         FROM courses co LEFT JOIN (${LESSONS_PER_COURSE}) lc ON lc.courseId = co.id
        ORDER BY students DESC, co.sortOrder, co.title`
    )
    .all();
  res.json({ data: rows });
}));

router.get('/courses/:slug', wrap(async (req, res) => {
  const db = getDB();
  const course = await courseRow(req.params.slug);
  if (!course) return res.status(404).json({ message: 'No such course' });
  const students = await db
    .prepare(
      `SELECT u.id, u.name, u.email, e.enrolledAt, e.completedAt,
              (SELECT COUNT(*) FROM lesson_progress lp
                 JOIN lessons l ON l.id = lp.lessonId JOIN chapters ch ON ch.id = l.chapterId
                WHERE lp.userId = u.id AND ch.courseId = e.courseId) AS lessonsDone,
              c.code AS certificateCode, c.score AS certificateScore, c.issuedAt AS certificateIssuedAt,
              (SELECT COUNT(*) FROM final_attempts f WHERE f.userId = u.id AND f.courseId = e.courseId AND f.submittedAt IS NOT NULL) AS finalAttempts,
              (SELECT MAX(f.marks) FROM final_attempts f WHERE f.userId = u.id AND f.courseId = e.courseId) AS bestFinal
         FROM enrollments e JOIN users u ON u.id = e.userId
         LEFT JOIN certificates c ON c.userId = e.userId AND c.courseId = e.courseId
        WHERE e.courseId = ?
        ORDER BY e.enrolledAt DESC`
    )
    .all(course.id);
  for (const s of students) s.lessonsDone = await finishedFor(s.id, course.slug);
  res.json({ data: { course, students } });
}));

// Course content lives in content/courses/*.js and is re-seeded whenever it
// changes, so an edit is kept in course_overrides and laid over the seeded
// row (content/seed.js). Taking a course off the website is the hidden flag,
// which the seeder never touches; enrolled learners keep their access.
const COURSE_FIELDS = {
  title: ['Title', 1, 200],
  summary: ['Summary', 0, 5000],
  description: ['Description', 0, 5000],
  category: ['Category', 1, 200],
  level: ['Level', 1, 200],
  duration: ['Duration', 1, 200],
};

router.patch('/courses/:slug', wrap(async (req, res) => {
  const { slug } = req.params;
  if (!(await courseRow(slug))) return fail(res, 404, 'No such course');
  const { values, error } = readFields(req.body, COURSE_FIELDS);
  if (error) return fail(res, 400, error);
  const hidden = req.body?.hidden;
  if (hidden !== undefined && typeof hidden !== 'boolean') return fail(res, 400, 'Hidden must be true or false');
  if (!Object.keys(values).length && hidden === undefined) return fail(res, 400, 'Nothing to change');

  const db = getDB();
  await db.transaction(async () => {
    if (Object.keys(values).length) {
      const fields = Object.keys(COURSE_FIELDS);
      await db
        .prepare(
          `INSERT INTO course_overrides (slug, ${fields.join(', ')}, updatedAt)
           VALUES (@slug, ${fields.map((f) => `@${f}`).join(', ')}, @now)
           ON CONFLICT(slug) DO UPDATE SET
             ${fields.map((f) => `${f} = COALESCE(excluded.${f}, course_overrides.${f})`).join(', ')},
             updatedAt = excluded.updatedAt`
        )
        .run({ slug, ...values, now: new Date().toISOString() });
      await applyCourseOverrides(slug);
    }
    if (hidden !== undefined) await db.prepare('UPDATE courses SET hidden = ? WHERE slug = ?').run(hidden ? 1 : 0, slug);
  })();
  await invalidateCourseCache().catch(() => {});
  await forgetCourseCertificates(slug);
  audit('edit course', slug);
  res.json({ data: await courseRow(slug) });
}));

router.post('/courses/:slug/reset', wrap(async (req, res) => {
  const { slug } = req.params;
  if (!(await courseRow(slug))) return fail(res, 404, 'No such course');
  const db = getDB();
  const restored = await db.transaction(async () => {
    await db.prepare('DELETE FROM course_overrides WHERE slug = ?').run(slug);
    return restoreCourseFromContent(slug);
  })();
  if (!restored) return fail(res, 404, 'This course has no content file to restore from');
  await invalidateCourseCache().catch(() => {});
  await forgetCourseCertificates(slug);
  audit('reset course', slug);
  res.json({ data: await courseRow(slug) });
}));

router.delete('/courses/:slug', wrap(async (req, res) => {
  const { changes } = await getDB().prepare('UPDATE courses SET hidden = 1 WHERE slug = ?').run(req.params.slug);
  if (!changes) return fail(res, 404, 'No such course');
  await invalidateCourseCache().catch(() => {});
  audit('remove course from website', req.params.slug);
  res.json({ data: { hidden: true } });
}));

// ------------------------------------------------------------- students
router.get('/users', wrap(async (req, res) => {
  const { limit, offset, page } = paging(req.query);
  // students only: the admin account is not one
  const where = `WHERE u.role <> 'admin'${req.query.search ? ' AND (u.name ILIKE ? OR u.email ILIKE ?)' : ''}`;
  const args = req.query.search ? [like(req.query.search), like(req.query.search)] : [];
  const db = getDB();
  const total = Number((await db.prepare(`SELECT COUNT(*) AS n FROM users u ${where}`).get(...args)).n) || 0;
  const rows = await db
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.emailVerified, u.createdAt,
              (SELECT COUNT(*) FROM enrollments e WHERE e.userId = u.id) AS courses,
              (SELECT COUNT(*) FROM certificates c WHERE c.userId = u.id) AS certificates
         FROM users u ${where}
        ORDER BY u.createdAt DESC LIMIT ${limit} OFFSET ${offset}`
    )
    .all(...args);
  res.json({ data: { rows, total, page, pageSize: limit } });
}));

router.get('/users/:id', wrap(async (req, res) => {
  const db = getDB();
  const user = await db
    .prepare('SELECT id, name, email, role, emailVerified, createdAt FROM users WHERE id = ?')
    .get(idOf(req.params.id));
  if (!user) return res.status(404).json({ message: 'No such user' });
  const courses = await db
    .prepare(
      `SELECT co.slug, co.title, e.enrolledAt, e.completedAt, COALESCE(lc.lessons, 0) AS lessons,
              (SELECT COUNT(*) FROM lesson_progress lp
                 JOIN lessons l ON l.id = lp.lessonId JOIN chapters ch ON ch.id = l.chapterId
                WHERE lp.userId = e.userId AND ch.courseId = e.courseId) AS lessonsDone,
              c.code AS certificateCode, c.score AS certificateScore, c.issuedAt AS certificateIssuedAt,
              (SELECT MAX(f.marks) FROM final_attempts f WHERE f.userId = e.userId AND f.courseId = e.courseId) AS bestFinal
         FROM enrollments e JOIN courses co ON co.id = e.courseId
         LEFT JOIN (${LESSONS_PER_COURSE}) lc ON lc.courseId = co.id
         LEFT JOIN certificates c ON c.userId = e.userId AND c.courseId = e.courseId
        WHERE e.userId = ? ORDER BY e.enrolledAt DESC`
    )
    .all(user.id);
  for (const c of courses) c.lessonsDone = await finishedFor(user.id, c.slug);
  res.json({ data: { user, courses } });
}));

const USER_COLUMNS = 'id, name, email, role, emailVerified, createdAt';
// A student the admin may change: exists, and is not the admin account.
// Answers the request itself and returns null when not.
const editableUser = async (res, id) => {
  const user = await getDB().prepare(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`).get(idOf(id));
  if (!user) fail(res, 404, 'No such user');
  else if (isAdminEmail(user.email)) fail(res, 400, 'The admin account is managed from the environment, not here');
  else return user;
  return null;
};

router.patch('/users/:id', wrap(async (req, res) => {
  const user = await editableUser(res, req.params.id);
  if (!user) return;
  const { values, error } = readFields(req.body, { name: ['Name', 2, 100], email: ['Email', 3, 254] });
  if (error) return fail(res, 400, error);
  if (values.email !== undefined) {
    values.email = values.email.toLowerCase();
    if (!EMAIL.test(values.email)) return fail(res, 400, 'Enter a valid email address');
  }
  const verified = req.body?.emailVerified;
  if (verified !== undefined) {
    if (typeof verified !== 'boolean') return fail(res, 400, 'Verified must be true or false');
    values.emailVerified = verified ? 1 : 0;
  }
  if (!Object.keys(values).length) return fail(res, 400, 'Nothing to change');

  const db = getDB();
  if (values.email && (await db.prepare('SELECT 1 FROM users WHERE LOWER(email) = ? AND id <> ?').get(values.email, user.id))) {
    return fail(res, 409, 'Another account already uses that email');
  }
  try {
    await db.transaction(async () => {
      const sets = Object.keys(values).map((k) => `${k} = @${k}`).join(', ');
      // Any admin edit also signs the student out everywhere (tokenVersion),
      // so a changed email or a withdrawn verification takes effect at once.
      await db
        .prepare(`UPDATE users SET ${sets}, tokenVersion = tokenVersion + 1, updatedAt = @now WHERE id = @id`)
        .run({ ...values, now: new Date().toISOString(), id: user.id });
      // Claude Pro applications keep a copy of who applied; keep it current.
      await db
        .prepare('UPDATE claude_pro_applications SET userName = ?, userEmail = ? WHERE userId = ?')
        .run(values.name ?? user.name, values.email ?? user.email, user.id);
    })();
  } catch (err) {
    if (err.code === '23505') return fail(res, 409, 'Another account already uses that email');
    throw err;
  }
  // The public certificate page shows the learner's name.
  await forgetCertificates(await certificateCodes('userId = ?', user.id));
  audit('edit student', `${user.id} ${user.email}`);
  res.json({ data: await db.prepare(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`).get(user.id) });
}));

// Everything that belongs to the account goes with it (ON DELETE CASCADE),
// and its tokens stop working: requireAuth finds no account for them.
router.delete('/users/:id', wrap(async (req, res) => {
  const user = await editableUser(res, req.params.id);
  if (!user) return;
  const db = getDB();
  const count = async (table) => Number((await db.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE userId = ?`).get(user.id)).n) || 0;
  const [enrollments, certificates] = [await count('enrollments'), await count('certificates')];
  const codes = await certificateCodes('userId = ?', user.id);
  await db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
  await forgetCertificates(codes);
  audit('delete student', `${user.id} ${user.email}`);
  res.json({ data: { deleted: true, enrollments, certificates } });
}));

// Takes a student out of one course and wipes their record in it, so a
// later enrolment starts from the beginning.
router.delete('/users/:id/courses/:slug', wrap(async (req, res) => {
  const db = getDB();
  const userId = idOf(req.params.id);
  const course = await courseBySlug(req.params.slug);
  if (!course) return fail(res, 404, 'No such course');
  if (!(await db.prepare('SELECT 1 FROM enrollments WHERE userId = ? AND courseId = ?').get(userId, course.id))) {
    return fail(res, 404, 'That student is not enrolled in this course');
  }
  const codes = await certificateCodes('userId = ? AND courseId = ?', userId, course.id);
  const inCourse = 'lessonId IN (SELECT l.id FROM lessons l JOIN chapters ch ON ch.id = l.chapterId WHERE ch.courseId = ?)';
  await db.transaction(async () => {
    await db.prepare(`DELETE FROM lesson_progress WHERE userId = ? AND ${inCourse}`).run(userId, course.id);
    await db.prepare(`DELETE FROM lesson_opens WHERE userId = ? AND ${inCourse}`).run(userId, course.id);
    for (const table of ['quiz_attempts', 'final_attempts', 'certificates', 'claude_pro_applications', 'enrollments']) {
      await db.prepare(`DELETE FROM ${table} WHERE userId = ? AND courseId = ?`).run(userId, course.id);
    }
  })();
  await forgetCertificates(codes);
  audit('remove student from course', `${userId} ${course.slug}`);
  res.json({ data: { removed: true } });
}));

// --------------------------------------------------------- certificates
router.get('/certificates', wrap(async (req, res) => {
  const { limit, offset, page } = paging(req.query);
  const s = req.query.search;
  const where = s ? 'WHERE c.code ILIKE ? OR u.name ILIKE ? OR u.email ILIKE ? OR co.title ILIKE ?' : '';
  const args = s ? [like(s), like(s), like(s), like(s)] : [];
  const from = 'FROM certificates c JOIN users u ON u.id = c.userId JOIN courses co ON co.id = c.courseId';
  const db = getDB();
  const total = Number((await db.prepare(`SELECT COUNT(*) AS n ${from} ${where}`).get(...args)).n) || 0;
  const rows = await db
    .prepare(
      `SELECT c.id, c.code, c.score, c.issuedAt, u.id AS userId, u.name AS userName, u.email AS userEmail,
              co.slug AS courseSlug, co.title AS courseTitle
         ${from} ${where} ORDER BY c.issuedAt DESC LIMIT ${limit} OFFSET ${offset}`
    )
    .all(...args);
  res.json({ data: { rows, total, page, pageSize: limit } });
}));

const CERTIFICATE_ROW = `SELECT c.id, c.code, c.score, c.issuedAt, u.id AS userId, u.name AS userName, u.email AS userEmail,
       co.slug AS courseSlug, co.title AS courseTitle
  FROM certificates c JOIN users u ON u.id = c.userId JOIN courses co ON co.id = c.courseId WHERE c.id = ?`;

router.patch('/certificates/:id', wrap(async (req, res) => {
  const score = req.body?.score;
  if (!Number.isInteger(score) || score < 0 || score > 100) return fail(res, 400, 'Score must be a whole number from 0 to 100');
  const db = getDB();
  const id = idOf(req.params.id);
  const { changes } = await db.prepare('UPDATE certificates SET score = ? WHERE id = ?').run(score, id);
  if (!changes) return fail(res, 404, 'No such certificate');
  const row = await db.prepare(CERTIFICATE_ROW).get(id);
  await forgetCertificates([row.code]);
  audit('edit certificate score', `${row.code} ${score}`);
  res.json({ data: row });
}));

// Revoking deletes the certificate; its public page then says not found.
router.delete('/certificates/:id', wrap(async (req, res) => {
  const row = await getDB().prepare('DELETE FROM certificates WHERE id = ? RETURNING code').get(idOf(req.params.id));
  if (!row) return fail(res, 404, 'No such certificate');
  await forgetCertificates([row.code]);
  audit('revoke certificate', row.code);
  res.json({ data: { deleted: true } });
}));

// ---------------------------------------------------------- internships
router.get('/internships', wrap(async (req, res) => {
  const { limit, offset, page } = paging(req.query);
  const s = req.query.search;
  const conds = [];
  const args = [];
  if (s) { conds.push('(name ILIKE ? OR email ILIKE ? OR internshipTitle ILIKE ?)'); args.push(like(s), like(s), like(s)); }
  if (req.query.title) { conds.push('internshipTitle = ?'); args.push(req.query.title); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const db = getDB();
  const total = Number((await db.prepare(`SELECT COUNT(*) AS n FROM internship_applications ${where}`).get(...args)).n) || 0;
  const rows = await db
    .prepare(`SELECT * FROM internship_applications ${where} ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`)
    .all(...args);
  const titles = await db
    .prepare('SELECT internshipTitle AS title, COUNT(*) AS n FROM internship_applications GROUP BY internshipTitle ORDER BY n DESC')
    .all();
  res.json({ data: { rows, total, page, pageSize: limit, titles } });
}));

router.patch('/internships/:id', wrap(async (req, res) => {
  const { values, error } = readFields(req.body, {
    name: ['Name', 2, 100],
    email: ['Email', 3, 254],
    phone: ['Phone', 0, 50],
    internshipTitle: ['Internship', 2, 200],
    resumeLink: ['Resume link', 0, 2000],
    coverLetter: ['Cover letter', 0, 10000],
  });
  if (error) return fail(res, 400, error);
  if (values.email !== undefined && !EMAIL.test(values.email)) return fail(res, 400, 'Enter a valid email address');
  if (values.resumeLink && !/^https?:\/\//i.test(values.resumeLink)) return fail(res, 400, 'Resume link must start with http:// or https://');
  if (!Object.keys(values).length) return fail(res, 400, 'Nothing to change');
  const id = idOf(req.params.id);
  const sets = Object.keys(values).map((k) => `${k} = @${k}`).join(', ');
  const row = await getDB()
    .prepare(`UPDATE internship_applications SET ${sets}, updatedAt = @now WHERE id = @id RETURNING *`)
    .get({ ...values, now: new Date().toISOString(), id });
  if (!row) return fail(res, 404, 'No such application');
  audit('edit internship application', id);
  res.json({ data: row });
}));

router.delete('/internships/:id', wrap(async (req, res) => {
  const id = idOf(req.params.id);
  const { changes } = await getDB().prepare('DELETE FROM internship_applications WHERE id = ?').run(id);
  if (!changes) return fail(res, 404, 'No such application');
  audit('delete internship application', id);
  res.json({ data: { deleted: true } });
}));

// ------------------------------------------------------------- messages
router.get('/messages', wrap(async (req, res) => {
  const { limit, offset, page } = paging(req.query);
  const conds = [];
  const args = [];
  if (req.query.status === 'open') conds.push('handled = 0');
  if (req.query.status === 'handled') conds.push('handled = 1');
  if (req.query.search) {
    conds.push('(name ILIKE ? OR email ILIKE ? OR subject ILIKE ? OR message ILIKE ?)');
    args.push(...Array(4).fill(like(req.query.search)));
  }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const db = getDB();
  const total = Number((await db.prepare(`SELECT COUNT(*) AS n FROM contact_messages ${where}`).get(...args)).n) || 0;
  const rows = await db
    .prepare(`SELECT * FROM contact_messages ${where} ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`)
    .all(...args);
  res.json({ data: { rows, total, page, pageSize: limit } });
}));

router.patch('/messages/:id', wrap(async (req, res) => {
  const { values, error } = readFields(req.body, {
    name: ['Name', 2, 100],
    email: ['Email', 3, 254],
    phone: ['Phone', 0, 50],
    subject: ['Subject', 0, 200],
    message: ['Message', 5, 5000],
  });
  if (error) return fail(res, 400, error);
  if (values.email !== undefined && !EMAIL.test(values.email)) return fail(res, 400, 'Enter a valid email address');
  if (req.body?.handled !== undefined) {
    if (typeof req.body.handled !== 'boolean') return fail(res, 400, 'Answered must be true or false');
    values.handled = req.body.handled ? 1 : 0;
  }
  if (!Object.keys(values).length) return fail(res, 400, 'Nothing to change');
  const id = idOf(req.params.id);
  const sets = Object.keys(values).map((k) => `${k} = @${k}`).join(', ');
  const row = await getDB()
    .prepare(`UPDATE contact_messages SET ${sets}, updatedAt = @now WHERE id = @id RETURNING *`)
    .get({ ...values, now: new Date().toISOString(), id });
  if (!row) return fail(res, 404, 'No such message');
  audit('edit message', `${id} ${Object.keys(values).join(',')}`);
  res.json({ ok: true, data: row });
}));

router.delete('/messages/:id', wrap(async (req, res) => {
  const id = idOf(req.params.id);
  const { changes } = await getDB().prepare('DELETE FROM contact_messages WHERE id = ?').run(id);
  if (!changes) return fail(res, 404, 'No such message');
  audit('delete message', id);
  res.json({ data: { deleted: true } });
}));

// ----------------------------------------------------------- claude pro
// Status changes stay on /api/learn/claude-pro/applicants/:id.
router.delete('/claude-pro/:id', wrap(async (req, res) => {
  const id = idOf(req.params.id);
  const { changes } = await getDB().prepare('DELETE FROM claude_pro_applications WHERE id = ?').run(id);
  if (!changes) return fail(res, 404, 'No such application');
  audit('delete claude pro application', id);
  res.json({ data: { deleted: true } });
}));

// ---------------------------------------------------------------- games
// Each game keeps its own players. It hands them over only for a one-minute
// token signed with GAME_SSO_SECRET for the admin audience, minted here.
const GAMES = {
  'gotcha-rush': { title: 'Gotcha Rush', url: () => process.env.GOTCHA_URL || 'http://localhost:3001', played: 'Matches', extra: { rounds: 'Rounds', correct: 'Correct', bestRush: 'Best rush' } },
  typedash: { title: 'TypeDash', url: () => process.env.TYPEDASH_URL || 'http://localhost:4001', played: 'Races', extra: { bestWpm: 'Best WPM', practiceRuns: 'Practice runs', dailyBest: 'Daily best' } },
  pickparty: { title: 'PickParty', url: () => process.env.PICKPARTY_URL || 'http://localhost:5001', played: 'Matches', extra: { soloBest: 'Solo best', soloRuns: 'Solo runs', topicsWon: 'Topics won' } },
};

// One call to a game's admin API. Throws only when the game cannot be
// reached; otherwise hands back its status and JSON for the caller to read.
const callGame = async (id, path, { method = 'GET', body } = {}) => {
  const secret = gameSsoSecret();
  if (!secret) throw new Error('GAME_SSO_SECRET is not set');
  const token = jwt.sign({}, secret, {
    algorithm: 'HS256', subject: 'admin', issuer: GAME_TOKEN_ISSUER, audience: 'cortexis-games-admin', expiresIn: 60,
  });
  const r = await fetch(`${GAMES[id].url().replace(/\/$/, '')}/api/admin/players${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(5000),
  });
  return { status: r.status, ok: r.ok, json: await r.json().catch(() => ({})) };
};

const fetchPlayers = async (id) => {
  const r = await callGame(id, '');
  if (!r.ok) throw new Error(`the game answered ${r.status}`);
  return r.json.players || [];
};

// Puts the website account next to every player who signed in with one.
const withAccounts = async (players) => {
  const ids = [...new Set(players.map((p) => p.cortexisUserId).filter(Boolean))];
  const accounts = ids.length
    ? await getDB().prepare('SELECT id, name, email FROM users WHERE id = ANY(?)').all(ids)
    : [];
  const byId = new Map(accounts.map((a) => [a.id, a]));
  return players.map((p) => ({ ...p, account: p.cortexisUserId ? byId.get(p.cortexisUserId) || null : null }));
};

router.get('/games', wrap(async (_req, res) => {
  const data = await Promise.all(
    Object.entries(GAMES).map(async ([id, g]) => {
      try {
        const players = await fetchPlayers(id);
        return { id, title: g.title, online: true, players: players.length, linked: players.filter((p) => p.cortexisUserId).length };
      } catch (err) {
        return { id, title: g.title, online: false, error: err.message };
      }
    })
  );
  res.json({ data });
}));

router.get('/games/:id/players', wrap(async (req, res) => {
  const game = Object.hasOwn(GAMES, req.params.id) ? GAMES[req.params.id] : null;
  if (!game) return res.status(404).json({ message: 'No such game' });
  let players;
  try {
    players = await fetchPlayers(req.params.id);
  } catch (err) {
    return res.status(502).json({ message: `${game.title} is not reachable: ${err.message}` });
  }
  const rows = (await withAccounts(players)).sort((a, b) => b.points - a.points);
  res.json({ data: { game: { id: req.params.id, title: game.title, played: game.played, extra: game.extra }, rows } });
}));

// Edits and deletes are the game's to make: it knows its own name rules and
// leaderboards. These only carry the request across with an admin token.
const gameWrite = (method) => wrap(async (req, res) => {
  const game = Object.hasOwn(GAMES, req.params.id) ? GAMES[req.params.id] : null;
  if (!game) return fail(res, 404, 'No such game');
  const pid = encodeURIComponent(req.params.pid);
  let r;
  try {
    r = await callGame(req.params.id, `/${pid}`, { method, body: method === 'PATCH' ? req.body || {} : undefined });
  } catch (err) {
    return fail(res, 502, `${game.title} is not reachable: ${err.message}`);
  }
  if (r.status === 400 || r.status === 404) return fail(res, r.status, r.json.error || 'The game refused that change');
  if (!r.ok) return fail(res, 502, `${game.title} answered ${r.status}`);
  audit(method === 'PATCH' ? 'edit player' : 'delete player', `${req.params.id} ${req.params.pid}`);
  if (method === 'DELETE') return res.json({ data: { deleted: true } });
  res.json({ data: (await withAccounts([r.json.player]))[0] });
});

router.patch('/games/:id/players/:pid', gameWrite('PATCH'));
router.delete('/games/:id/players/:pid', gameWrite('DELETE'));

export default router;
