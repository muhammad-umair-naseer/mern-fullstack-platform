import rateLimit, { MemoryStore } from 'express-rate-limit';
import { getRedisClient, isRedisReady } from '../services/redis.service.js';
import { queuePrefix } from '../config/redis.js';
const stores = [];
const SCRIPT = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]) end; return {n,redis.call('PTTL',KEYS[1])}";
class ResilientStore {
  constructor(prefix) { this.prefix = prefix; this.memory = new MemoryStore(); this.localKeys = true; }
  init(options) { this.windowMs = options.windowMs; this.memory.init(options); }
  async increment(key) {
    // Keep the local counter warm: a Redis outage must not reset attempts.
    const local = await this.memory.increment(key);
    if (!isRedisReady()) return local;
    try {
      const [hits, ttl] = await getRedisClient().eval(SCRIPT, 1, this.prefix + key, this.windowMs);
      return { totalHits: Math.max(local.totalHits, Number(hits)), resetTime: new Date(Date.now() + Math.max(0, Number(ttl))) };
    } catch { return local; }
  }
  async decrement(key) { await this.memory.decrement(key); if (isRedisReady()) await getRedisClient().decr(this.prefix + key).catch(() => {}); }
  async resetKey(key) { await this.memory.resetKey(key); if (isRedisReady()) await getRedisClient().del(this.prefix + key); }
  shutdown() { this.memory.shutdown(); }
}
export const createLimiter = ({ windowMs, max, prefix, message }) => {
  const store = new ResilientStore(queuePrefix() + ':ratelimit:' + prefix + ':');
  stores.push(store);
  return rateLimit({ windowMs, limit: max, standardHeaders: 'draft-7', legacyHeaders: false, store,
    message: { message: message || 'Too many requests; please try again later' } });
};
export async function resetTestLimits(key = '127.0.0.1') {
  if (process.env.NODE_ENV !== 'test') throw new Error('Test-only operation');
  await Promise.all(stores.map(store => store.resetKey(key)));
}
export const closeLimiters = () => stores.forEach(store => store.shutdown());
