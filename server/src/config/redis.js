import { integer } from './environment.js';
export function redisOptions({ blocking = false } = {}) {
  const env = process.env;
  const options = {
    host: env.REDIS_HOST || '127.0.0.1', port: integer(env.REDIS_PORT, 6379),
    password: env.REDIS_PASSWORD || undefined, db: integer(env.REDIS_DB, 0, 0, 15),
    tls: env.REDIS_TLS === 'true' ? { rejectUnauthorized: true } : undefined,
    maxRetriesPerRequest: blocking ? null : 1, enableOfflineQueue: blocking,
    connectTimeout: integer(env.REDIS_CONNECT_TIMEOUT, 3000),
    ...(!blocking ? { commandTimeout: integer(env.REDIS_COMMAND_TIMEOUT, 3000) } : {}),
    retryStrategy: times => Math.min(times * 250, 3000),
  };
  if (env.REDIS_URL) {
    const url = new URL(env.REDIS_URL);
    if (!['redis:', 'rediss:'].includes(url.protocol)) throw new Error('Invalid Redis protocol');
    Object.assign(options, { host: url.hostname.replace(/^\[|\]$/g, ''), port: integer(url.port || undefined, 6379), username: decodeURIComponent(url.username) || undefined, password: decodeURIComponent(url.password) || undefined, db: integer(url.pathname.slice(1) || undefined, 0, 0, 15), tls: url.protocol === 'rediss:' ? { rejectUnauthorized: true } : undefined });
  }
  return options;
}
export const queuePrefix = () => 'cortexis-' + (process.env.NODE_ENV || 'development') + (process.env.TEST_RUN_ID ? '-' + process.env.TEST_RUN_ID : '');
