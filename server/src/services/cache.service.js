import { redisGet, redisSet, redisDel, redisDelByPattern, isRedisReady } from './redis.service.js';

/**
 * Cache Service with Stampede Protection (Request Coalescing / Single-Flight)
 * 
 * Guarantees:
 * 1. Cache-aside reading & population.
 * 2. Deduplication of concurrent database queries during cache misses (single-flight).
 * 3. Graceful fallback to database when Redis is offline.
 * 4. Strict isolation: Public cached payloads contain zero user/session/auth data.
 */

const inFlightRequests = new Map();

const getEnvironment = () => {
  return process.env.NODE_ENV === 'production' ? 'production' : (process.env.NODE_ENV || 'development');
};

export const CACHE_TTL = {
  COURSE_LIST: 3600,       // 1 hour
  COURSE_OUTLINE: 3600,    // 1 hour
  CERTIFICATE: 86400,      // 24 hours (immutable once issued)
  QUIZ_QUESTIONS: 3600,    // 1 hour
};

export const CACHE_KEYS = {
  courseList: () => `cortexis:${getEnvironment()}:cache:courses:list`,
  courseOutline: (slug) => `cortexis:${getEnvironment()}:cache:courses:outline:${encodeURIComponent(String(slug).toLowerCase())}`,
  certificate: (code) => `cortexis:${getEnvironment()}:cache:certificate:${encodeURIComponent(String(code).toUpperCase())}`,
  quizQuestions: (scope, id) => `cortexis:${getEnvironment()}:cache:quiz:questions:${scope}:${id}`,
  courseOutlinePattern: () => `cortexis:${getEnvironment()}:cache:courses:outline:*`,
};

/**
 * Cache-Aside with Stampede Protection (Single-Flight Request Coalescing)
 * 
 * @template T
 * @param {string} key - Cache key
 * @param {() => Promise<T> | T} fetcher - Database/computation callback
 * @param {number} ttlSeconds - Time to live in seconds
 * @returns {Promise<{ data: T, cached: boolean }>}
 */
export const getOrSet = async (key, fetcher, ttlSeconds = 3600) => {
  // 1. Try Cache Hit
  const cached = await redisGet(key);
  if (cached !== null && cached !== undefined) {
    return { data: cached, cached: true };
  }

  // 2. Cache Stampede Protection: Deduplicate in-flight concurrent requests for the same key
  if (inFlightRequests.has(key)) {
    try {
      const coalescedData = await inFlightRequests.get(key);
      return { data: coalescedData, cached: true };
    } catch {
      // If the coalesced promise failed, fallback to direct fetcher
      const fallbackData = await fetcher();
      return { data: fallbackData, cached: false };
    }
  }

  // 3. Initiate single-flight execution
  const fetchPromise = (async () => {
    const freshData = await fetcher();
    if (freshData !== null && freshData !== undefined) {
      // Asynchronously store in Redis (non-blocking for the response)
      redisSet(key, freshData, ttlSeconds).catch(() => {});
    }
    return freshData;
  })();

  inFlightRequests.set(key, fetchPromise);

  try {
    const result = await fetchPromise;
    return { data: result, cached: false };
  } finally {
    // Clean up single-flight tracking
    inFlightRequests.delete(key);
  }
};

/**
 * Invalidate all course catalog and course outline caches
 */
export const invalidateCourseCache = async () => {
  const listKey = CACHE_KEYS.courseList();
  const outlinePattern = CACHE_KEYS.courseOutlinePattern();
  
  await Promise.all([
    redisDel(listKey),
    redisDelByPattern(outlinePattern)
  ]);
};

/**
 * Invalidate specific course outline cache
 */
export const invalidateCourseOutline = async (slug) => {
  if (!slug) return;
  const key = CACHE_KEYS.courseOutline(slug);
  await redisDel(key);
};

/**
 * Invalidate certificate cache entry
 */
export const invalidateCertificate = async (code) => {
  if (!code) return;
  const key = CACHE_KEYS.certificate(code);
  await redisDel(key);
};

/**
 * Cache helper to pre-warm / set certificate cache directly upon issuance
 */
export const cacheCertificate = async (code, certData) => {
  if (!code || !certData) return;
  const key = CACHE_KEYS.certificate(code);
  await redisSet(key, certData, CACHE_TTL.CERTIFICATE);
};
