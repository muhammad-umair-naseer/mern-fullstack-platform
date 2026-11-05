import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { createLimiter } from '../../middleware/rateLimiter.js';
import { register, verify, resend, login, me, logout, gameToken } from './auth.controller.js';

/** Authentication routing. Handlers live in ../controllers/auth.controller.js. */
const router = Router();

// Credential endpoints get a tighter limit than the rest of the API.
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  prefix: 'auth',
  message: 'Too many attempts — please wait a few minutes',
});

router.post('/register', authLimiter, register);
router.post('/verify', authLimiter, verify);
router.post('/resend', authLimiter, resend);
router.post('/login', authLimiter, login);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

// The website's game page asks for one of these each time a game loads, and
// again when the game asks, so the ceiling sits well above the credential limit.
const gameTokenLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
  prefix: 'game-token',
  message: 'Too many game sign-ins — please wait a few minutes',
});
router.post('/game-token', gameTokenLimiter, requireAuth, gameToken);

export default router;
