import crypto from 'crypto';
import { getDB } from '../setup/db.js';
import { sendVerificationCode } from './verificationMail.js';

/**
 * Email-verification code lifecycle.
 *
 * An account is unusable until its code is confirmed, so everything about
 * generating, storing and expiring codes lives here rather than in the routes.
 */

export const CODE_TTL_MIN = 30;
export const MAX_CODE_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SEC = 60;

export const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  emailVerified: Boolean(u.emailVerified),
  createdAt: u.createdAt,
});

// crypto.randomInt is uniform; Math.random is not, and this gates account access.
export const makeCode = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');

export const issueCode = (db, user) => {
  const code = makeCode();
  const now = new Date();
  db.prepare(
    `UPDATE users SET verifyCode = ?, verifyExpires = ?, verifySentAt = ?, verifyAttempts = 0, updatedAt = ?
     WHERE id = ?`
  ).run(
    code,
    new Date(now.getTime() + CODE_TTL_MIN * 60_000).toISOString(),
    now.toISOString(),
    now.toISOString(),
    user.id
  );
  return code;
};

/** Issues a fresh code and emails it. Returns whether delivery succeeded. */
export const issueAndSend = async (db, user) => {
  const code = issueCode(db, user);
  return sendVerificationCode({ name: user.name, email: user.email, code });
};
