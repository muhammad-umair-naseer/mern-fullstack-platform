import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './setup/db.js';
import { seedCourses } from './content/seed.js';
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

// Rate limits (anti-spam for forms)
const formLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Learners page through lessons quickly, so this ceiling is much higher than
// the form limiter's — but still bounded.
const learnLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// --- API routes ---
app.use('/api/internships', formLimiter, internshipsRouter);
app.use('/api/contact', formLimiter, contactRouter);
app.use('/api/auth', authRouter);
app.use('/api/learn', learnLimiter, learnRouter);

app.get('/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

// --- Serve the React build in production ---
// Registered after the API so the catch-all cannot swallow /api/* requests.
if (process.env.NODE_ENV === 'production') {
  const buildDir = path.join(__dirname, '../../client/build');
  app.use(express.static(buildDir));
  app.get('*', (_req, res) => res.sendFile(path.join(buildDir, 'index.html')));
}

// --- Start ---
const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    const { courses, lessons } = await seedCourses();
    console.log(`📚 Seeded ${courses} course(s), ${lessons} lesson(s)`);
    app.listen(PORT, () => console.log(`\n✅ Server listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  });
