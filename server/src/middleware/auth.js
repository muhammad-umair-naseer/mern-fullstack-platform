import jwt from 'jsonwebtoken';
import { getDB } from '../setup/db.js';

// A weak fallback would silently "work" in production, which is worse than a
// loud failure — so refuse to sign anything without a configured secret.
export const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('JWT_SECRET missing or too short — set a long random value in server/.env');
  }
  return secret;
};

export const signToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email }, getSecret(), { expiresIn: '30d' });

const readToken = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : null;
};

export const requireAuth = async (req, res, next) => {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: 'Sign in to continue' });

  try {
    const payload = jwt.verify(token, getSecret());
    const user = await getDB()
      .prepare('SELECT id, name, email, role, emailVerified, createdAt FROM users WHERE id = ?')
      .get(payload.sub);

    // The token can outlive the account it names.
    if (!user) return res.status(401).json({ message: 'Account no longer exists' });

    // Tokens are only issued after verification, but re-check here so a token
    // that predates the rule (or an account later un-verified) cannot slip past.
    if (!user.emailVerified) {
      return res.status(403).json({
        needsVerification: true,
        email: user.email,
        message: 'Confirm your email address to continue',
      });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Session expired — please sign in again' });
  }
};

// For endpoints that work signed-out but return extra detail when signed in.
export const optionalAuth = async (req, _res, next) => {
  const token = readToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, getSecret());
      const u = await getDB()
        .prepare('SELECT id, name, email, role, emailVerified, createdAt FROM users WHERE id = ?')
        .get(payload.sub);
      req.user = u && u.emailVerified ? u : null;
    } catch {
      req.user = null;
    }
  }
  next();
};

/** Checks if a user is an administrator via email or assigned database role */
export const isUserAdmin = (user) => {
  if (!user || !user.email) return false;
  const adminEmails = [
    process.env.ADMIN_ALERT_TO,
    process.env.CONTACT_TO,
    ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : []),
  ]
    .filter(Boolean)
    .map((e) => e.trim().toLowerCase());

  if (adminEmails.includes(user.email.toLowerCase())) return true;
  if (user.role && String(user.role).toLowerCase() === 'admin') return true;
  return false;
};

/** Strictly gates endpoints to authorized administrators only */
export const requireAdmin = async (req, res, next) => {
  await requireAuth(req, res, () => {
    if (!isUserAdmin(req.user)) {
      return res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }
    next();
  });
};

