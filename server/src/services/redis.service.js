import { redisOptions } from '../config/redis.js';
import Redis from 'ioredis';

/**
 * Singleton Redis Service
 * 
 * Provides an asynchronous, multiplexed Redis client with automatic reconnects,
 * robust error resilience, and graceful degradation fallback.
 * 
 * Designed to never crash the Express application if Redis is offline or unreachable.
 */

let client = null;
let isConnected = false;
let isReady = false;
let connectionAttempted = false;

const setupClientListeners = (redisInstance) => {
  redisInstance.on('connect', () => {
    isConnected = true;
  });

  redisInstance.on('ready', () => {
    isReady = true;
    console.log('⚡ Redis connected and ready');
  });

  redisInstance.on('error', (err) => {
    isReady = false;
    isConnected = false;
    const safeMsg = err?.message || 'Redis connection error';
    if (!connectionAttempted) {
      console.warn(`⚠️ Redis notice: ${safeMsg} (Caching will gracefully fall back to direct DB queries)`);
    }
  });

  redisInstance.on('close', () => {
    isReady = false;
    isConnected = false;
  });

  redisInstance.on('reconnecting', () => {
    isReady = false;
  });
};

export const getRedisClient = () => {
  if (!client) {
    if (process.env.REDIS_DISABLED === 'true' && process.env.NODE_ENV === 'test') return null;
    try {
      client = new Redis({ ...redisOptions(), lazyConnect: true });
      setupClientListeners(client);
    } catch (err) {
      console.warn(`⚠️ Redis client creation error: ${err.message}`);
      return null;
    }
  }
  return client;
};

export const initRedis = async () => {
  const instance = getRedisClient();
  if (!instance) return null;
  try {
    connectionAttempted = true;
    if (instance.status === 'wait') await instance.connect();
    if (instance.status !== 'ready') throw new Error('Redis not ready');
    return instance;
  } catch {
    if (process.env.NODE_ENV === 'production') throw new Error('Production Redis is unavailable');
    console.warn('Redis unavailable; using local rate limits and direct mail');
    return null;
  }
};

export const isRedisReady = () => Boolean(client && isReady);

/**
 * Safe Get with JSON deserialization
 */
export const redisGet = async (key) => {
  if (!isRedisReady()) return null;
  try {
    const raw = await client.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    // Non-fatal: on any parse error or redis timeout, return null to trigger DB fetch
    return null;
  }
};

/**
 * Safe Set with TTL in seconds and JSON serialization
 */
export const redisSet = async (key, value, ttlSeconds = 3600) => {
  if (!isRedisReady()) return false;
  try {
    const serialized = JSON.stringify(value);
    if (ttlSeconds > 0) {
      await client.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await client.set(key, serialized);
    }
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Safe Delete single or multiple keys
 */
export const redisDel = async (...keys) => {
  if (!isRedisReady() || !keys.length) return 0;
  try {
    return await client.del(...keys);
  } catch (err) {
    return 0;
  }
};

/**
 * Safe non-blocking pattern deletion using SCAN (never KEYS * in production)
 */
export const redisDelByPattern = async (pattern) => {
  if (!isRedisReady() || !pattern) return 0;
  let cursor = '0';
  let deletedCount = 0;
  try {
    do {
      const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      if (keys && keys.length > 0) {
        const count = await client.del(...keys);
        deletedCount += count;
      }
    } while (cursor !== '0');
    return deletedCount;
  } catch (err) {
    return deletedCount;
  }
};

/**
 * Health check & diagnostic ping
 */
export const redisPing = async () => {
  if (!isRedisReady()) return { ok: false, status: 'disconnected', latencyMs: null };
  const start = performance.now();
  try {
    const reply = await client.ping();
    const latencyMs = Number((performance.now() - start).toFixed(2));
    return { ok: reply === 'PONG', status: 'ready', latencyMs };
  } catch (err) {
    return { ok: false, status: 'error', error: err.message, latencyMs: null };
  }
};

/**
 * Diagnostics and memory usage stats (sanitized, no secrets)
 */
export const redisStats = async () => {
  if (!isRedisReady()) return { status: 'disconnected' };
  try {
    const info = await client.info('memory');
    const usedMemoryMatch = info.match(/used_memory_human:(.+)/);
    const peakMemoryMatch = info.match(/used_memory_peak_human:(.+)/);
    return {
      status: 'ready',
      usedMemory: usedMemoryMatch ? usedMemoryMatch[1].trim() : 'unknown',
      peakMemory: peakMemoryMatch ? peakMemoryMatch[1].trim() : 'unknown'
    };
  } catch {
    return { status: 'ready', info: 'unavailable' };
  }
};

/**
 * Graceful shutdown hook
 */
export const closeRedis = async () => {
  if (client) {
    try {
      if (client.status === 'ready') await client.quit(); else client.disconnect();
    } catch {
      client.disconnect();
    }
    client = null;
    isReady = false;
    isConnected = false;
  }
};
