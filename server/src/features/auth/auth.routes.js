import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { createLimiter } from '../../middleware/rateLimiter.js';
import { register, verify, resend, login, me, logout, gameToken } from './auth.controller.js';

/** Authentication routing. Handlers live in ../controllers/auth.controller.js. */
const router = Router();

// Per-IP limits. Many visitors share one IP here (mobile CGNAT, university
// labs), so each sits above what one person needs but far below a script.
const WAIT = 'Too many attempts — please wait a few minutes';
const loginLimiter = createLimiter({ windowMs: 15 * 60 * 1000, max: 10, prefix: 'login', message: WAIT });
const verifyLimiter = createLimiter({ windowMs: 15 * 60 * 1000, max: 20, prefix: 'verify', message: WAIT });
// register and resend both send a code email, so they share one counter.
const codeLimiter = createLimiter({ windowMs: 60 * 60 * 1000, max: 10, prefix: 'code', message: 'Too many sign-up attempts — please try again later' });

// Per-email cap on code emails, so no one can flood an inbox from many IPs.
// Only codes actually sent count (skipFailedRequests): a request refused by
// the 60 s cooldown cannot be used to use up someone else's daily allowance.
const emailKey = req => String(req.body?.email || '').trim().toLowerCase();
const codeEmailLimiter = createLimiter({
  windowMs: 24 * 60 * 60 * 1000, max: 10, prefix: 'code-email',
  keyGenerator: emailKey, skip: req => !emailKey(req).includes('@'), skipFailedRequests: true,
  message: 'Too many codes sent to this email today — please try again tomorrow',
});

router.post('/register', codeLimiter, codeEmailLimiter, register);
router.post('/verify', verifyLimiter, verify);
router.post('/resend', codeLimiter, codeEmailLimiter, resend);
router.post('/login', loginLimiter, login);
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
