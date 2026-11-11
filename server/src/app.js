import { validateEnvironment } from './config/environment.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB, getDB } from './setup/db.js';
import { initRedis, isRedisReady } from './services/redis.service.js';
import { seedCourses } from './content/seed.js';
import { ensureAdmin } from './setup/admin.js';
import { createLimiter } from './middleware/rateLimiter.js';
import { initWorker } from './workers/email.worker.js';
import internshipsRouter from './features/forms/internships.routes.js';
import contactRouter from './features/forms/contact.routes.js';
import authRouter from './features/auth/auth.routes.js';
import learnRouter from './features/learning/learn.routes.js';
import adminRouter from './features/admin/admin.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { version: VERSION } = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const app = express();

// --- Security & middleware ---

// How many reverse proxies sit in front of the API. Unset (local) trusts
// none; behind one TLS proxy in production set TRUST_PROXY=1, so req.ip, and
// with it every rate limit and ADMIN_ALLOWED_IPS, sees the visitor and not
// the proxy. A number counts hops; anything else goes to Express as written.
const trustProxy = (process.env.TRUST_PROXY || '').trim();
app.set('trust proxy', !trustProxy || trustProxy === 'false' ? false : /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);

// Browsers may call the API only from these origins: the website, the admin
// portal and the three games (they sign in against /api/auth directly).
// CORS_ORIGINS replaces the list; in development the same ports on a LAN
// address are let through too, so the site works from a phone on the Wi-Fi.
const DEV_PORTS = ['3000', '3001', '4001', '5001', '6001', '7001'];
const corsOrigins = (process.env.CORS_ORIGINS || DEV_PORTS.map((p) => `http://localhost:${p}`).join(','))
  .split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean);
const lanOrigin = (origin) => {
  const m = /^http:\/\/(127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|[\w-]+\.local):(\d+)$/.exec(origin);
  return Boolean(m) && DEV_PORTS.includes(m[3]);
};
const corsAllowed = (origin) =>
  corsOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && lanOrigin(origin));

app.disable('x-powered-by');
const production = process.env.NODE_ENV === 'production';
const gameOrigins = (process.env.GAME_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: production ? { directives: {
  defaultSrc: ["'self'"], scriptSrc: ["'self'", "'wasm-unsafe-eval'"], styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'], imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
  mediaSrc: ["'self'", 'data:', 'blob:'], connectSrc: ["'self'", 'data:', 'blob:', 'https://api.microlink.io', 'https://*.microlink.io', ...gameOrigins.flatMap(origin => [origin, origin.replace(/^https:/, 'wss:')])],
  frameSrc: ["'self'", 'blob:', ...gameOrigins], workerSrc: ["'self'", 'blob:'], objectSrc: ["'none'"], baseUri: ["'self'"], formAction: ["'self'"], frameAncestors: ["'none'"],
} } : false, strictTransportSecurity: production ? { maxAge: 31536000 } : false }));
app.use('/api', createLimiter({ windowMs: 60000, max: 1000, prefix: 'api' }));
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  const origin = req.headers.origin;
  if (origin && !corsAllowed(origin)) return res.status(403).json({ message: 'Origin not allowed' });
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.headers['sec-fetch-site'] === 'cross-site' && !origin) return res.status(403).json({ message: 'Cross-site request refused' });
  next();
});
// No Origin header (curl, same-origin pages) needs no CORS answer at all.
app.use(cors({ origin: (origin, cb) => cb(null, !origin || corsAllowed(origin)), credentials: false }));
app.use(express.json({ limit: '1mb', inflate: false }));
// Admin searches are learner emails: log /api/admin requests without the query.
morgan.token('url', (req) => {
  const url = req.originalUrl || req.url;
  return url.split('?')[0];
});
app.use(morgan(production ? ':method :url :status :response-time ms' : 'dev', { skip: () => process.env.NODE_ENV === 'test' }));

// Rate limits (anti-spam for forms with distributed Redis support & fallback)
const formLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  prefix: 'form',
  message: 'Too many submissions — please wait a few minutes',
});

// Learners page through lessons quickly, so this ceiling is much higher than
// the form limiter's — but still bounded.
const learnLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 300,
  prefix: 'learn',
});

// --- API routes ---
app.use('/api/internships', formLimiter, internshipsRouter);
app.use('/api/contact', formLimiter, contactRouter);
app.use('/api/auth', authRouter);
app.use('/api/learn', learnLimiter, learnRouter);
app.use('/api/admin', createLimiter({ windowMs: 60000, max: 120, prefix: 'admin' }), adminRouter);
app.use('/api', (_req, res) => res.status(404).json({ message: 'API endpoint not found' }));

// Public health is only up-or-down and the version; the details help an
// attacker time a restart, so they live at /api/admin/health.
app.get('/health', (_req, res) => res.json({ ok: true, version: VERSION }));

app.get('/ready', async (_req, res) => {
  try { await getDB().prepare('SELECT 1 AS ok').get(); if (production && !isRedisReady()) throw new Error('Redis unavailable'); res.json({ ok: true }); }
  catch { res.status(503).json({ ok: false }); }
});

// Last stop for any error a route passed on, or a body that is not valid JSON.
// The message is generic whatever NODE_ENV says: stack traces stay in the log.


// --- Serve the React build in production ---
// Registered after the API so the catch-all cannot swallow /api/* requests.
if (process.env.NODE_ENV === 'production') {
  const buildDir = path.join(__dirname, '../../client/build');
  const shell = path.join(buildDir, 'index.html');
  // redirect:false — a directory URL such as /tools/pdf-merger must not 301 to
  // a trailing slash; the sitemap lists it without one, and a redirect on every
  // tool page is what search engines then index instead of the page.
  app.use(express.static(buildDir, { redirect: false }));
  app.get('*', (req, res) => {
    // The prerender writes <route>/index.html for every public route. Serve
    // that page when it exists, and the SPA shell for everything else.
    const target = path.normalize(path.join(buildDir, req.path, 'index.html'));
    if (target.startsWith(buildDir + path.sep) && fs.existsSync(target)) return res.sendFile(target);
    const aliases = { '/yourbot': '/your-bot', '/automations': '/your-bot', '/apply': '/internships', '/apply-now': '/internships', '/internship': '/internships' };
    if (aliases[req.path]) return res.redirect(301, aliases[req.path]);
    if (/^\/whatsapp-bot(?:\/|$)/.test(req.path)) return res.redirect(301, req.path.replace('/whatsapp-bot', '/your-bot'));
    // Public catalogue routes are all prerendered. Missing slugs must be real
    // HTTP 404s rather than an indexable 200 containing a "not found" page.
    const lessonRoute = /^\/learn\/([^/]+)\/(?:lesson\/\d+|quiz\/\d+|final)\/?$/.exec(req.path);
    const knownLesson = lessonRoute && fs.existsSync(path.join(buildDir, 'learn', lessonRoute[1], 'index.html'));
    const known = /^\/(?:login|signup|dashboard)\/?$/.test(req.path) || /^\/certificate\/[^/]+\/?$/.test(req.path) || knownLesson;
    return res.status(known ? 200 : 404).sendFile(shell);
  });
}

/**
 * Prepare everything the app needs before it can take a request: the
 * database connection, Redis, the seeded catalogue and, unless a standalone
 * worker deployment says otherwise, the in-process email worker.
 *
 * Split from listen() so a test can boot the app against a scratch database
 * and drive it over HTTP on an ephemeral port without a real server process.
 */
export const boot = async ({ worker = process.env.EMBEDDED_WORKER !== 'false' } = {}) => {
  validateEnvironment();
  await Promise.all([connectDB(), initRedis()]);
  if (worker && isRedisReady()) initWorker();
  const { courses, lessons } = await getDB().transaction(async () => {
    await getDB().prepare('SELECT pg_advisory_xact_lock(72451002)').get();
    return seedCourses();
  })();
  await ensureAdmin();
  return { courses, lessons };
};

// Must be after all routes and static handlers, including malformed JSON errors.
app.use((err, req, res, _next) => {
  const status = err.status >= 400 && err.status < 500 ? err.status : 500;
  if (status === 500) console.error('Request failed:', req.method, req.path, err.code || 'internal');
  res.status(status).json({ message: status === 500 ? 'Something went wrong' : 'Bad request' });
});

export default app;
