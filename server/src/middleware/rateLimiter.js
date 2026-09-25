import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedisClient, isRedisReady } from '../services/redis.service.js';

/**
 * Creates an Express Rate Limiter with Distributed Redis Store support
 * and graceful fallback to in-memory tracking if Redis is unavailable.
 */
export const createLimiter = ({ windowMs, max, prefix, message }) => {
  const env = process.env.NODE_ENV === 'production' ? 'production' : (process.env.NODE_ENV || 'development');
  const fullPrefix = `cortexis:${env}:ratelimit:${prefix}:`;

  const store = new RedisStore({
    sendCommand: (...args) => {
      const client = getRedisClient();
      if (!client) throw new Error('Redis client unavailable');
      // While the first connection is still being made, ioredis queues the
      // command and runs it on connect. Once Redis is known to be down, that
      // queue would only fail at the command timeout and stall every request
      // by that long — refuse up front so passOnStoreError lets it through.
      if (!isRedisReady() && ['reconnecting', 'close', 'end'].includes(client.status)) {
        throw new Error('Redis client unavailable');
      }
      return client.call(...args);
    },
    prefix: fullPrefix,
  });

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store,
    message: message ? { message } : undefined,
    // When Redis is offline or errors, pass the request through rather than 500 erroring
    passOnStoreError: true,
  });
};
