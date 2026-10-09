import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getDB } from '../setup/db.js';
import { signToken } from '../middleware/auth.js';
import { gameSsoSecret, signGameToken, GAME_TOKEN_TTL_SEC } from '../services/gameSso.js';
import {
  registerSchema,
  loginSchema,
  verifySchema,
  resendSchema,
} from '../validation/schemas.js';
import { smtpReady } from '../services/verificationMail.js';
import {
  queueVerificationEmail,
  queueSignupNotification,
  queueAdminAlert,
} from '../services/queue.service.js';
import {
  publicUser,
  issueCode,
  codeBlocked,
  claimAttempt,
} from '../services/verification.service.js';

/** Registration, email verification, resend, and sign-in. */

// ------------------------------------------------------------------ register

export const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({ message: 'Validation failed', errors: error.details });
    }

    const db = getDB();
    const email = value.email;
    const existing = await db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (existing) {
      // An unverified account is a half-finished signup, not a conflict — let
      // them resume rather than telling them the address is taken.
      if (!existing.emailVerified) {
        const blocked = codeBlocked(existing);
        if (blocked) return res.status(blocked.status).json({ message: blocked.message });
        // Whoever asks for a code now is the one who will confirm it, so their
        // name and password replace the earlier attempt's. Otherwise someone
        // could sign up with another person's address first and keep a
        // password to the account that person later verifies.
        await db
          .prepare('UPDATE users SET name = ?, passwordHash = ?, updatedAt = ? WHERE id = ?')
          .run(value.name, await bcrypt.hash(value.password, 10), new Date().toISOString(), existing.id);
        const code = await issueCode(db, existing);
        queueVerificationEmail({ name: value.name, email, code });
        return res.status(200).json({
          needsVerification: true,
          email,
          emailSent: smtpReady(),
          message: 'That signup was unfinished — we sent a fresh code to your email',
        });
      }
      return res.status(409).json({ message: 'That email is already registered — try signing in' });
    }

    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash(value.password, 10);
    const { lastInsertRowid } = await db
      .prepare(
        `INSERT INTO users (name, email, passwordHash, emailVerified, createdAt, updatedAt)
         VALUES (?, ?, ?, 0, ?, ?)`
      )
      .run(value.name, email, passwordHash, now, now);

    const user = await db.prepare('SELECT * FROM users WHERE id = ?').get(lastInsertRowid);
    const code = await issueCode(db, user);
    
    // Dispatch asynchronous jobs via BullMQ (with automatic retry & fallback)
    queueVerificationEmail({ name: user.name, email, code });
    queueSignupNotification({ name: user.name, email });

    // No token here — the account is unusable until the code is confirmed.
    return res.status(201).json({
      needsVerification: true,
      email,
      emailSent: smtpReady(),
      message: `We sent a 6-digit code to ${email}`,
    });
  } catch (err) {
    console.error('Register error:', err);
    queueAdminAlert({
      key: 'signup-failing',
      subject: 'Signup failing',
      detail: 'An unexpected error was thrown while handling a credential request.',
      context: { error: err.message },
    });
    return res.status(500).json({ message: 'Could not create your account' });
  }
};

// -------------------------------------------------------------------- verify

export const verify = async (req, res) => {
  try {
    const { error, value } = verifySchema.validate(req.body, { stripUnknown: true });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const db = getDB();
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(value.email);
    if (!user) return res.status(400).json({ message: 'Invalid or expired code' });

    // A verified account has no code left to check, so this endpoint has
    // nothing to give it: a session only comes from signing in.
    if (user.emailVerified) return res.status(400).json({ message: 'Invalid or expired code' });

    // Every try is counted before it is checked, in one statement, so guesses
    // sent in parallel cannot all slip under the cap. At the cap it stays shut
    // until a new code is sent, which resend and register refuse until the
    // lockout has run out (verification.service.js).
    if (!(await claimAttempt(db, user))) {
      return res.status(429).json({
        message: 'Too many incorrect codes — request a new one',
        needsResend: true,
      });
    }

    const expired = !user.verifyExpires || new Date(user.verifyExpires) < new Date();
    // Constant-time compare so the endpoint cannot be probed digit by digit.
    const supplied = Buffer.from(String(value.code));
    const actual = Buffer.from(String(user.verifyCode || ''));
    const matches =
      supplied.length === actual.length && crypto.timingSafeEqual(supplied, actual);

    if (expired || !matches) {
      return res.status(400).json({
        message: expired ? 'That code has expired — request a new one' : 'Invalid or expired code',
        needsResend: expired,
      });
    }

    const now = new Date().toISOString();
    await db.prepare(
      `UPDATE users SET emailVerified = 1, verifyCode = NULL, verifyExpires = NULL,
       verifyAttempts = 0, verifyLockUntil = NULL, updatedAt = ? WHERE id = ?`
    ).run(now, user.id);

    const verified = await db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
    return res.json({ token: signToken(verified), user: publicUser(verified) });
  } catch (err) {
    console.error('Verify error:', err);
    queueAdminAlert({
      key: 'verification-failing',
      subject: 'Verification failing',
      detail: 'An unexpected error was thrown while handling a credential request.',
      context: { error: err.message },
    });
    return res.status(500).json({ message: 'Could not verify your email' });
  }
};

// -------------------------------------------------------------------- resend

export const resend = async (req, res) => {
  try {
    const { error, value } = resendSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: 'A valid email is required' });

    const db = getDB();
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(value.email);

    // Always answer the same way, so this cannot be used to discover accounts.
    const generic = { message: 'If that account needs verifying, a new code is on its way' };
    if (!user || user.emailVerified) return res.json(generic);

    const blocked = codeBlocked(user);
    if (blocked) return res.status(blocked.status).json({ message: blocked.message });

    const code = await issueCode(db, user);
    queueVerificationEmail({ name: user.name, email: user.email, code });
    return res.json({ ...generic, emailSent: smtpReady() });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ message: 'Could not send a new code' });
  }
};

// --------------------------------------------------------------------- login

// Same cost factor as real hashes; no password matches it.
const DUMMY_HASH = bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10);

export const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: 'Email and password are required' });

    const user = await getDB().prepare('SELECT * FROM users WHERE email = ?').get(value.email);

    // Identical response for unknown email and wrong password, so this endpoint
    // cannot be used to discover which addresses have accounts. An unknown
    // email still pays for one bcrypt compare, so the timing matches too.
    const ok = await bcrypt.compare(value.password, user?.passwordHash || DUMMY_HASH);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    // Credentials are correct but the address was never confirmed. Only reached
    // after a valid password, so it reveals nothing to an outsider.
    if (!user.emailVerified) {
      return res.status(403).json({
        needsVerification: true,
        email: user.email,
        message: 'Confirm your email address to sign in — check your inbox for the code',
      });
    }

    return res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    queueAdminAlert({
      key: 'sign-in-failing',
      subject: 'Sign-in failing',
      detail: 'An unexpected error was thrown while handling a credential request.',
      context: { error: err.message },
    });
    return res.status(500).json({ message: 'Could not sign you in' });
  }
};

export const me = (req, res) => res.json({ user: publicUser(req.user) });

// ---------------------------------------------------------------- game token

/**
 * Trade the site session for a 10-minute token the games accept (see
 * services/gameSso.js). requireAuth has already refused unknown accounts and
 * unverified addresses, the same way login does.
 */
export const gameToken = (req, res) => {
  const secret = gameSsoSecret();
  if (!secret) {
    return res.status(503).json({ message: 'Game sign-in is not configured on this server' });
  }
  const user = { id: req.user.id, name: req.user.name };
  return res.json({
    token: signGameToken(user, secret),
    user,
    expiresIn: GAME_TOKEN_TTL_SEC,
  });
};
