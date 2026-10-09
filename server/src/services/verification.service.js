import crypto from 'crypto';
import { getDB } from '../setup/db.js';
import { sendVerificationCode } from './verificationMail.js';
import { isUserAdmin } from '../middleware/auth.js';

/**
 * Email-verification code lifecycle.
 *
 * An account is unusable until its code is confirmed, so everything about
 * generating, storing and expiring codes lives here rather than in the routes.
 */

export const CODE_TTL_MIN = 30;
export const MAX_CODE_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SEC = 60;
// Five wrong codes lock the address for this long. Neither signing up again
// nor asking for a new code clears the count, so the 1-in-a-million code
// cannot be guessed by cycling through fresh ones.
export const CODE_LOCK_MIN = 15;

export const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role || (isUserAdmin(u) ? 'admin' : 'user'),
  isAdmin: isUserAdmin(u),
  emailVerified: Boolean(u.emailVerified),
  createdAt: u.createdAt,
});

// crypto.randomInt is uniform; Math.random is not, and this gates account access.
export const makeCode = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');

/**
 * Why a fresh code cannot be sent to this unverified account right now, as
 * { status, message } for the response, or null when it can.
 */
export const codeBlocked = (user) => {
  const lockedFor = (new Date(user.verifyLockUntil || 0).getTime() - Date.now()) / 1000;
  if (lockedFor > 0) {
    return { status: 429, message: `Too many incorrect codes — try again in ${Math.ceil(lockedFor / 60)} min` };
  }
  const since = user.verifySentAt ? (Date.now() - new Date(user.verifySentAt).getTime()) / 1000 : Infinity;
  if (since < RESEND_COOLDOWN_SEC) {
    return { status: 429, message: `Please wait ${Math.ceil(RESEND_COOLDOWN_SEC - since)}s before requesting another code` };
  }
  return null;
};

/**
 * Counts one try at the code, or returns false when the cap is already
 * reached. The try that reaches the cap starts the lockout; a right code
 * clears both afterwards.
 */
export const claimAttempt = async (db, user) =>
  Boolean(
    await db.prepare(
      `UPDATE users SET verifyAttempts = verifyAttempts + 1,
         verifyLockUntil = CASE WHEN verifyAttempts + 1 >= ? THEN ? ELSE verifyLockUntil END
       WHERE id = ? AND verifyAttempts < ? RETURNING id`
    ).get(MAX_CODE_ATTEMPTS, new Date(Date.now() + CODE_LOCK_MIN * 60_000).toISOString(), user.id, MAX_CODE_ATTEMPTS)
  );

// The attempt count carries over to the new code. Callers check codeBlocked
// first, so a count at the cap here means its lockout has run out, which is
// the one time it starts again.
export const issueCode = async (db, user) => {
  const code = makeCode();
  const now = new Date();
  await db.prepare(
    `UPDATE users SET verifyCode = ?, verifyExpires = ?, verifySentAt = ?,
       verifyAttempts = CASE WHEN verifyAttempts >= ${MAX_CODE_ATTEMPTS} THEN 0 ELSE verifyAttempts END,
       verifyLockUntil = NULL, updatedAt = ?
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
  const code = await issueCode(db, user);
  return sendVerificationCode({ name: user.name, email: user.email, code });
};
