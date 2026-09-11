import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB } from './setup/db.js';
import { initRedis, redisPing, redisStats, closeRedis } from './services/redis.service.js';
import { seedCourses } from './content/seed.js';
import { createLimiter } from './middleware/rateLimiter.js';
import internshipsRouter from './routes/internships.routes.js';
import contactRouter from './routes/contact.routes.js';
import authRouter from './routes/auth.routes.js';
import learnRouter from './routes/learn.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// --- Security & middleware ---
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Rate limits (anti-spam for forms with distributed Redis support & fallback)
const formLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 20,
  prefix: 'form',
  message: 'Too many submissions — please wait a minute',
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

app.get('/health', async (_req, res) => {
  const redis = await redisPing();
  const stats = await redisStats();
  res.json({
    ok: true,
    uptime: Number(process.uptime().toFixed(2)),
    database: 'sqlite (connected)',
    redis: {
      status: redis.status,
      latencyMs: redis.latencyMs,
      usedMemory: stats.usedMemory ?? 'n/a',
    },
  });
});

// --- Serve the React build in production ---
// Registered after the API so the catch-all cannot swallow /api/* requests.
if (process.env.NODE_ENV === 'production') {
  const buildDir = path.join(__dirname, '../../client/build');
  app.use(express.static(buildDir));
  app.get('*', (_req, res) => res.sendFile(path.join(buildDir, 'index.html')));
}

// --- Start ---
const PORT = process.env.PORT || 5000;

Promise.all([connectDB(), initRedis()])
  .then(async () => {
    const { courses, lessons } = await seedCourses();
    console.log(`📚 Seeded ${courses} course(s), ${lessons} lesson(s)`);
    app.listen(PORT, () => console.log(`\n✅ Server listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  });

// --- Graceful Shutdown ---
const handleShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
  await closeRedis();
  process.exit(0);
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

