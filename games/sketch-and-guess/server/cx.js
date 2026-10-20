'use strict';
const crypto = require('crypto');

/**
 * Cortexis sign-in for the game server.
 *
 *   verifyGameToken(token)  checks a 10-minute HS256 token minted by the
 *                           website's POST /api/auth/game-token
 *   siteConfig(req)         where the website and its API live, and which
 *                           origins may embed the game and post it a token
 *   headerCountry(req)      the visitor's country from a CDN header, if any
 *
 * The secret is GAME_SSO_SECRET, shared with the website API. Outside
 * production (NODE_ENV is not 'production') an unset secret falls back to the
 * same named constant the API uses, for player sign-in only, with a loud
 * warning. That constant is public, so admin tokens are never checked with it,
 * and production refuses it outright. No dependency: node:crypto.
 */

const ISSUER = 'cortexis';
const AUDIENCE = 'cortexis-games';
// The admin portal's reads (/api/admin/*): minted by the website API for an
// admin only, never accepted as a player sign-in, and the other way round.
const ADMIN_AUDIENCE = 'cortexis-games-admin';
const CLOCK_SKEW_SEC = 30;
const DEV_SECRET = 'cortexis-dev-only-game-sso-secret--do-not-use-in-production';
const PROD = process.env.NODE_ENV === 'production';

/** The key for this audience, or null when that sign-in must stay off. */
function secret(audience = AUDIENCE) {
  const key = process.env.GAME_SSO_SECRET || (PROD ? null : DEV_SECRET);
  if (key === DEV_SECRET && (PROD || audience === ADMIN_AUDIENCE)) return null;
  return key;
}

if (secret() === DEV_SECRET) {
  console.warn([
    '',
    '[cx] ************************************************************************',
    '[cx] GAME_SSO_SECRET is not set: player sign-in uses the PUBLIC development',
    '[cx] secret, so anyone can sign in as any Cortexis player on this server.',
    '[cx] The admin portal\'s player tools stay off until a real secret is set.',
    '[cx] Set the same long random GAME_SSO_SECRET here and in server/.env.',
    '[cx] ************************************************************************',
    '',
  ].join('\n'));
}

const ssoReady = () => !!secret();

class TokenError extends Error {
  constructor(message, code = 'invalid') { super(message); this.code = code; }
}

function b64json(part) {
  try { return JSON.parse(Buffer.from(part, 'base64url').toString('utf8')); } catch (_) { return null; }
}

/**
 * Verify a game token. Returns { sub, name, exp } or throws a TokenError
 * whose code is 'config' (no secret), 'expired' or 'invalid'.
 */
function verifyGameToken(token, { now = Date.now(), audience = AUDIENCE, key = secret(audience) } = {}) {
  if (!key) throw new TokenError('Cortexis sign-in is not configured on this game server.', 'config');
  if (typeof token !== 'string' || token.length > 4096) throw new TokenError('Missing sign-in token.');
  const parts = token.split('.');
  if (parts.length !== 3) throw new TokenError('Malformed sign-in token.');
  const [h, p, s] = parts;
  const header = b64json(h);
  if (!header || header.alg !== 'HS256') throw new TokenError('Unsupported sign-in token.');
  const expected = crypto.createHmac('sha256', key).update(`${h}.${p}`).digest();
  let given;
  try { given = Buffer.from(s, 'base64url'); } catch (_) { given = Buffer.alloc(0); }
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) throw new TokenError('Sign-in token signature does not match.');
  const claims = b64json(p);
  if (!claims || typeof claims !== 'object') throw new TokenError('Malformed sign-in token.');
  if (claims.iss !== ISSUER) throw new TokenError('Sign-in token has the wrong issuer.');
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!aud.includes(audience)) throw new TokenError('Sign-in token is not meant for this use.');
  const t = Math.floor(now / 1000);
  if (typeof claims.exp !== 'number' || claims.exp + CLOCK_SKEW_SEC < t) throw new TokenError('Sign-in token has expired.', 'expired');
  if (typeof claims.nbf === 'number' && claims.nbf - CLOCK_SKEW_SEC > t) throw new TokenError('Sign-in token is not valid yet.');
  if (typeof claims.iat === 'number' && claims.iat - CLOCK_SKEW_SEC > t) throw new TokenError('Sign-in token was issued in the future.');
  const sub = String(claims.sub == null ? '' : claims.sub);
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(sub)) throw new TokenError('Sign-in token names no account.');
  return { sub, name: typeof claims.name === 'string' ? claims.name : '', exp: claims.exp };
}

/** Mint a token the way the website does. Tests and local tooling only. */
function signGameToken({ sub, name = '', ttlSec = 600, now = Date.now(), iss = ISSUER, aud = AUDIENCE, key = secret(aud) } = {}) {
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const iat = Math.floor(now / 1000);
  const h = enc({ alg: 'HS256', typ: 'JWT' });
  const p = enc({ name, sub: String(sub), iss, aud, iat, exp: iat + ttlSec });
  const s = crypto.createHmac('sha256', key).update(`${h}.${p}`).digest('base64url');
  return `${h}.${p}.${s}`;
}

/* ----------------------------------------------------------- site origins */

const clean = (u) => String(u || '').trim().replace(/\/+$/, '');
const originOf = (u) => { try { return new URL(u).origin; } catch (_) { return null; } };

/**
 * Where the Cortexis website lives, from env, else the development default:
 * the same hostname as this request on :3000 (site) and :5000 (API), so a
 * phone on the LAN reaching the game by IP gets links that work for it.
 *
 *   CORTEXIS_SITE_URL        https://cortexis.example      links (sign up)
 *   CORTEXIS_API_URL         defaults to the site URL      /api/auth/* calls
 *   CORTEXIS_PARENT_ORIGINS  comma list; defaults to the site origin
 */
function siteConfig(req) {
  const proto = String((req && req.headers['x-forwarded-proto']) || '').split(',')[0].trim() || (req && req.socket && req.socket.encrypted ? 'https' : 'http');
  const hostHeader = String((req && (req.headers['x-forwarded-host'] || req.headers.host)) || 'localhost');
  let hostname = 'localhost';
  try { hostname = new URL(`${proto}://${hostHeader.split(',')[0].trim()}`).hostname; } catch (_) { /* keep localhost */ }
  const host = hostname.includes(':') && !hostname.startsWith('[') ? `[${hostname}]` : hostname;

  const envSite = clean(process.env.CORTEXIS_SITE_URL);
  const siteUrl = envSite || `${proto}://${host}:3000`;
  const apiUrl = clean(process.env.CORTEXIS_API_URL) || (envSite ? envSite : `${proto}://${host}:5000`);
  const parents = (process.env.CORTEXIS_PARENT_ORIGINS || '')
    .split(',').map((o) => originOf(clean(o))).filter(Boolean);
  if (!parents.length) parents.push(originOf(siteUrl));
  return {
    siteUrl,
    apiUrl,
    signupUrl: `${siteUrl}/signup`,
    parentOrigins: [...new Set(parents.filter(Boolean))],
    ssoReady: ssoReady(),
  };
}

/* --------------------------------------------------------------- country */

const COUNTRY_HEADERS = ['cf-ipcountry', 'x-country-code', 'x-vercel-ip-country'];
const NOT_A_COUNTRY = new Set(['XX', 'T1', 'ZZ', 'EU', 'AP', 'A1', 'A2', 'O1']);

/** ISO country from a CDN / proxy header, or null. The IP itself is never read or stored. */
function headerCountry(req) {
  if (!req || !req.headers) return null;
  for (const h of COUNTRY_HEADERS) {
    const v = String(req.headers[h] || '').trim().toUpperCase();
    if (/^[A-Z]{2}$/.test(v) && !NOT_A_COUNTRY.has(v)) return v;
  }
  return null;
}

/** A client-supplied guess, if it is a plausible ISO code. */
function guessCountry(raw) {
  const v = typeof raw === 'string' ? raw.trim().toUpperCase() : '';
  return /^[A-Z]{2}$/.test(v) && !NOT_A_COUNTRY.has(v) && v !== 'UN' ? v : null;
}

/**
 * A Cortexis name as a game nickname: whole words while they fit, so
 * "Muhammad Umair Naseer" becomes "Muhammad Umair", not "Muhammad Umair N".
 */
function nicknameFrom(fullName, maxLen = 16) {
  const words = String(fullName || '').replace(/[\u0000-\u001f\u007f<>]/g, '').trim().split(/\s+/).filter(Boolean);
  let out = '';
  for (const w of words) {
    const next = out ? `${out} ${w}` : w;
    if (next.length > maxLen) break;
    out = next;
  }
  return out || (words[0] || '').slice(0, maxLen);
}

module.exports = { verifyGameToken, signGameToken, siteConfig, headerCountry, guessCountry, nicknameFrom, ssoReady, TokenError, DEV_SECRET, ISSUER, AUDIENCE, ADMIN_AUDIENCE };
