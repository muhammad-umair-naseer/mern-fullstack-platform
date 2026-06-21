import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';


import { connectDB } from './setup/db.js';
import coursesRouter from './routes/courses.routes.js';
import internshipsRouter from './routes/internships.routes.js';
import contactRouter from './routes/contact.routes.js';


const app = express();


// --- Security & middleware ---
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));


// Rate limits (anti-spam for forms)
const formLimiter = rateLimit({
windowMs: 60 * 1000, // 1 minute
max: 20,
standardHeaders: true,
legacyHeaders: false,
});


// Routes
app.use('/api/courses', formLimiter, coursesRouter);
app.use('/api/internships', formLimiter, internshipsRouter);
app.use('/api/contact', formLimiter, contactRouter);


// Health check
app.get('/health', (req, res) => {
res.json({ ok: true, uptime: process.uptime() });
});


// Start
const PORT = process.env.PORT || 5000;
connectDB()
.then(() => {
app.listen(PORT, () => console.log(`\n✅ Server listening on http://localhost:${PORT}`));
})
.catch((err) => {
console.error('❌ Failed to connect DB:', err);
process.exit(1);
});

import path from 'path';
import { fileURLToPath } from 'url';

// Needed for ES modules (__dirname equivalent)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Your existing API routes ---
// app.use('/api/courses', formLimiter, coursesRouter);
// app.use('/api/internships', formLimiter, internshipsRouter);
// app.use('/api/contact', formLimiter, contactRouter);

// --- Serve React build in production ---
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));

  // Catch-all to serve React index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });
}
