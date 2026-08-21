import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import { register, verify, resend, login, me } from '../controllers/auth.controller.js';

/** Authentication routing. Handlers live in ../controllers/auth.controller.js. */
const router = Router();

// Credential endpoints get a tighter limit than the rest of the API.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts — please wait a few minutes' },
});

router.post('/register', authLimiter, register);
router.post('/verify', authLimiter, verify);
router.post('/resend', authLimiter, resend);
router.post('/login', authLimiter, login);
router.get('/me', requireAuth, me);

export default router;
