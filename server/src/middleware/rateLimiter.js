import rateLimit, { MemoryStore } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedisClient, isRedisReady } from '../services/redis.service.js';

/**
 * Counts in Redis, so every API process shares one limit, and falls back to
 * counting in this process's memory while Redis is down or erroring. The
 * limit never simply switches off: an outage must not open /api/auth to
 * unlimited password and code guessing.
 */
class FallbackStore {
  constructor(redis) {
    this.redis = redis;
    this.memory = new MemoryStore();
  }

  init(options) {
    this.redis.init?.(options);
    this.memory.init(options);
  }

  async use(method, key) {
    if (isRedisReady()) {
      try {
        return await this.redis[method](key);
      } catch {
        /* fall through to memory */
      }
    }
    return this.memory[method](key);
  }

  increment(key) { return this.use('increment', key); }
  decrement(key) { return this.use('decrement', key); }
  resetKey(key) { return this.use('resetKey', key); }
}

/**
 * Creates an Express Rate Limiter with Distributed Redis Store support
 * and fallback to in-memory tracking if Redis is unavailable.
 */
export const createLimiter = ({ windowMs, max, prefix, message }) => {
  const env = process.env.NODE_ENV === 'production' ? 'production' : (process.env.NODE_ENV || 'development');
  const fullPrefix = `cortexis:${env}:ratelimit:${prefix}:`;

  const store = new RedisStore({
    sendCommand: async (...args) => {
      const client = getRedisClient();
      if (!client || !isRedisReady()) {
        if (args[0] === 'SCRIPT') return 'dummy-sha';
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
    store: new FallbackStore(store),
    message: message ? { message } : undefined,
  });
};
