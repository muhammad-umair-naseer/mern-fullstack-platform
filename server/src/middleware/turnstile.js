// Cloudflare Turnstile bot check for the public forms. The browser widget
// (client/src/components/Turnstile.jsx) puts a single-use token in the body as
// turnstileToken; Cloudflare's siteverify confirms it was solved for this
// action on our own hostname. Enforced only when TURNSTILE_SECRET_KEY is set
// (production), so tests and local dev run without it. If Cloudflare cannot be
// reached the request is refused (fail closed) and the admin is alerted.
// A request that passed Cloudflare Access (the admin portal on admin.*)
// carries Access's signed token instead, and needs no Turnstile.
import { queueAdminAlert } from '../services/queue.service.js';
import { hasAccess } from './cloudflareAccess.js';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const refuse = res => res.status(403).json({ message: 'Security check failed — please try again', turnstile: true });

const ownHosts = () => {
  const host = new URL(process.env.SITE_URL).hostname;
  return [host, `www.${host}`];
};

export const requireTurnstile = action => async (req, res, next) => {
  const token = req.body?.turnstileToken;
  if (req.body) delete req.body.turnstileToken;      // never reaches validation or storage
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || await hasAccess(req)) return next();
  if (typeof token !== 'string' || !token || token.length > 2048) return refuse(res);
  let result;
  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: req.ip }),
      signal: AbortSignal.timeout(5000),
    });
    result = await response.json();
  } catch (err) {
    queueAdminAlert({
      key: 'turnstile-unreachable',
      subject: 'Bot check unreachable',
      detail: 'Cloudflare Turnstile could not be reached, so sign-ups, sign-ins and forms are being refused.',
      context: { code: err.name || 'error' },
    });
    return res.status(503).json({ message: 'Security check unavailable — please try again in a minute' });
  }
  if (!result.success || result.action !== action || !ownHosts().includes(result.hostname)) return refuse(res);
  next();
};
