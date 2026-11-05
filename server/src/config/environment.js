import crypto from 'node:crypto';
import revoked from './revoked-secrets.json' with { type: 'json' };
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
if (process.env.NODE_ENV !== 'test') dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });
export const isProduction = () => process.env.NODE_ENV === 'production';
export const integer = (value, fallback, min = 1, max = 65535) => {
  const n = Number(value ?? fallback);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error('Invalid numeric configuration');
  return n;
};
export function validateEnvironment({ worker = false } = {}) {
  if (!isProduction()) return;
  const env = process.env;
  for (const [key, digest] of Object.entries(revoked)) if (env[key] && crypto.createHash('sha256').update(env[key]).digest('hex') === digest) throw new Error(key + ' was exposed and must be rotated');
  const required = ['JWT_SECRET', 'DATABASE_URL', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO', 'ADMIN_ALERT_TO'];
  if (!worker) required.push('ADMIN_EMAIL', 'ADMIN_PASSWORD', 'SITE_URL', 'CORS_ORIGINS');
  const missing = required.filter(key => !env[key]?.trim());
  if (missing.length) throw new Error('Missing production configuration: ' + missing.join(', '));
  for (const key of ['JWT_SECRET', 'GAME_SSO_SECRET', 'EMAIL_QUEUE_SECRET']) {
    if (env[key] && (env[key].length < 32 || /dev-only|test-secret|change.?me|placeholder/i.test(env[key]))) throw new Error('Unsafe ' + key + ': generate a new random secret');
  }
  if (env.ADMIN_PASSWORD && (env.ADMIN_PASSWORD.length < 12 || Buffer.byteLength(env.ADMIN_PASSWORD) > 72)) throw new Error('ADMIN_PASSWORD must contain at least 12 characters and at most 72 UTF-8 bytes');
  const db = new URL(env.DATABASE_URL);
  if (!['localhost', '127.0.0.1', '[::1]', 'postgres'].includes(db.hostname) && env.DATABASE_SSL !== 'true') throw new Error('Remote PostgreSQL requires verified TLS (DATABASE_SSL=true)');
  for (const origin of [env.SITE_URL, ...(env.CORS_ORIGINS || '').split(','), ...(env.GAME_ORIGINS || '').split(',')].filter(Boolean)) {
    const url = new URL(origin.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.origin !== origin.trim().replace(/\/$/, '')) throw new Error('Production origins must be exact HTTPS origins');
  }
  if (env.TRUST_PROXY === 'true') throw new Error('TRUST_PROXY must identify trusted proxy addresses or hop count');
  if (!env.REDIS_PASSWORD && !(env.REDIS_URL && new URL(env.REDIS_URL).password)) throw new Error('Production Redis requires authentication');
  integer(env.PORT, 5000); integer(env.SMTP_PORT, 587);
}
