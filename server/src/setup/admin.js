import bcrypt from 'bcryptjs';
import { getDB } from './db.js';

/**
 * The admin account lives in the environment, not behind a sign-up form:
 * ADMIN_EMAIL and ADMIN_PASSWORD. Every boot makes sure that account exists,
 * is verified, has the admin role and signs in with ADMIN_PASSWORD, so
 * changing the password in .env and restarting is how it is changed.
 * Nothing on the website can create or promote an admin.
 */
export const ensureAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!email || !password) {
    console.warn('Admin account not set up: ADMIN_EMAIL and ADMIN_PASSWORD are needed in the environment.');
    return;
  }
  if (password.length < 12) {
    console.warn('Admin account not set up: ADMIN_PASSWORD must be at least 12 characters.');
    return;
  }

  const db = getDB();
  const now = new Date().toISOString();
  const user = await db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(email);
  if (!user) {
    await db
      .prepare(
        `INSERT INTO users (name, email, passwordHash, role, emailVerified, createdAt, updatedAt)
         VALUES (?, ?, ?, 'admin', 1, ?, ?)`
      )
      .run('Cortexis Admin', email, await bcrypt.hash(password, 10), now, now);
    console.log(`Admin account created for ${email}`);
    return;
  }

  const samePassword = await bcrypt.compare(password, user.passwordHash);
  if (user.role === 'admin' && user.emailVerified && samePassword) return;
  await db
    .prepare('UPDATE users SET role = ?, emailVerified = 1, passwordHash = ?, updatedAt = ? WHERE id = ?')
    .run('admin', samePassword ? user.passwordHash : await bcrypt.hash(password, 10), now, user.id);
  console.log(`Admin account updated for ${email}`);
};

/** The one admin: the account named by ADMIN_EMAIL. */
export const isAdminEmail = (email) =>
  Boolean(email) && email.trim().toLowerCase() === (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
