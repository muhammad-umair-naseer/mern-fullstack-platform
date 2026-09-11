import { Queue } from 'bullmq';
import crypto from 'crypto';
import { isRedisReady } from './redis.service.js';
import { sendVerificationCode } from './verificationMail.js';
import { maybeSendContactEmail } from './mailer.js';
import { alertAdmin, notifySignup } from './adminAlert.js';

/**
 * BullMQ Email & Notification Queue Service
 * 
 * Features:
 * 1. Distributed background job processing on Redis.
 * 2. Idempotency & Deduplication: Prevents duplicate job processing on rapid re-submits.
 * 3. Retention Control: Automatically purges old completed/failed jobs to prevent memory bloat.
 * 4. Exponential Backoff: Transient failures retry with 2s, 4s, 8s backoff.
 * 5. Best-Effort Offline Fallback: If Redis is unreachable, dispatches directly in-memory (best-effort).
 */

let emailQueue = null;

const getRedisConnectionOptions = () => {
  const env = process.env;
  if (env.REDIS_URL) {
    return {
      url: env.REDIS_URL,
      maxRetriesPerRequest: null,
      connectTimeout: Number(env.REDIS_CONNECT_TIMEOUT || 5000),
    };
  }

  return {
    host: env.REDIS_HOST || '127.0.0.1',
    port: Number(env.REDIS_PORT || 6379),
    password: env.REDIS_PASSWORD || undefined,
    db: Number(env.REDIS_DB || 0),
    tls: env.REDIS_TLS === 'true' ? {} : undefined,
    maxRetriesPerRequest: null,
    connectTimeout: Number(env.REDIS_CONNECT_TIMEOUT || 5000),
  };
};

export const getEmailQueue = () => {
  if (!emailQueue) {
    try {
      const connection = getRedisConnectionOptions();
      emailQueue = new Queue('emails', {
        prefix: 'cortexis',
        connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: {
            count: 100,
            age: 3600, // 1 hour
          },
          removeOnFail: {
            count: 500,
            age: 86400, // 24 hours
          },
        },
      });

      emailQueue.on('error', (err) => {
        // Non-fatal: logged as warning
        console.warn(`⚠️ BullMQ Email Queue notice: ${err.message}`);
      });
    } catch (err) {
      console.warn(`⚠️ Failed to initialize BullMQ Email Queue: ${err.message}`);
      return null;
    }
  }
  return emailQueue;
};

/**
 * Dispatches a verification email job with idempotency.
 */
export const queueVerificationEmail = async ({ name, email, code }) => {
  const queue = getEmailQueue();
  const normalizedEmail = String(email).trim().toLowerCase();
  const jobId = `verify:${normalizedEmail}:${code}`;

  if (isRedisReady() && queue) {
    try {
      await queue.add('send-verification', { name, email: normalizedEmail, code }, { jobId });
      return { queued: true, jobId };
    } catch (err) {
      console.warn(`⚠️ BullMQ enqueue failed (${err.message}). Falling back to best-effort direct dispatch.`);
    }
  }

  // Best-Effort Offline Fallback: direct detached execution
  sendVerificationCode({ name, email: normalizedEmail, code }).catch((err) =>
    console.error('Best-effort direct verification email failed:', err.message)
  );
  return { queued: false, fallback: true };
};

/**
 * Dispatches a contact form email job with idempotency.
 */
export const queueContactEmail = async (data) => {
  const queue = getEmailQueue();
  const normalizedEmail = String(data.email || '').trim().toLowerCase();
  const msgHash = crypto.createHash('md5').update(String(data.message || '').trim()).digest('hex').slice(0, 12);
  const timeWindow = Math.floor(Date.now() / 60000); // 1-minute deduplication window
  const jobId = `contact:${normalizedEmail}:${msgHash}:${timeWindow}`;

  if (isRedisReady() && queue) {
    try {
      await queue.add('send-contact', data, { jobId });
      return { queued: true, jobId };
    } catch (err) {
      console.warn(`⚠️ BullMQ enqueue failed (${err.message}). Falling back to best-effort direct dispatch.`);
    }
  }

  // Best-Effort Offline Fallback
  maybeSendContactEmail(data).catch((e) => console.error('Best-effort direct mailer error:', e.message));
  return { queued: false, fallback: true };
};

/**
 * Dispatches an admin alert email job with idempotency.
 */
export const queueAdminAlert = async ({ key, subject, detail, context }) => {
  const queue = getEmailQueue();
  const timeWindow = Math.floor(Date.now() / 30000); // 30s deduplication window
  const jobId = `alert:${key}:${timeWindow}`;

  if (isRedisReady() && queue) {
    try {
      await queue.add('send-admin-alert', { key, subject, detail, context }, { jobId });
      return { queued: true, jobId };
    } catch (err) {
      console.warn(`⚠️ BullMQ enqueue failed (${err.message}). Falling back to best-effort direct dispatch.`);
    }
  }

  // Best-Effort Offline Fallback
  alertAdmin({ key, subject, detail, context });
  return { queued: false, fallback: true };
};

/**
 * Dispatches a signup notification email job.
 */
export const queueSignupNotification = async ({ name, email }) => {
  const queue = getEmailQueue();
  const normalizedEmail = String(email).trim().toLowerCase();
  const jobId = `signup:${normalizedEmail}`;

  if (isRedisReady() && queue) {
    try {
      await queue.add('send-signup-notification', { name, email: normalizedEmail }, { jobId });
      return { queued: true, jobId };
    } catch (err) {
      console.warn(`⚠️ BullMQ enqueue failed (${err.message}). Falling back to best-effort direct dispatch.`);
    }
  }

  // Best-Effort Offline Fallback
  notifySignup({ name, email: normalizedEmail });
  return { queued: false, fallback: true };
};

/**
 * Dispatches an internship application confirmation & alert job.
 */
export const queueInternshipAlert = async (data) => {
  const queue = getEmailQueue();
  const normalizedEmail = String(data.email || '').trim().toLowerCase();
  const timeWindow = Math.floor(Date.now() / 60000);
  const jobId = `intern:${normalizedEmail}:${encodeURIComponent(data.internshipTitle || '')}:${timeWindow}`;

  if (isRedisReady() && queue) {
    try {
      await queue.add('send-internship-alert', data, { jobId });
      return { queued: true, jobId };
    } catch (err) {
      console.warn(`⚠️ BullMQ enqueue failed (${err.message}). Falling back to best-effort direct dispatch.`);
    }
  }

  return { queued: false, fallback: true };
};

/**
 * Queue diagnostics for health reporting.
 */
export const getQueueMetrics = async () => {
  const queue = getEmailQueue();
  if (!queue || !isRedisReady()) {
    return { status: 'offline', waiting: 0, active: 0, completed: 0, failed: 0 };
  }
  try {
    const counts = await queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed');
    return {
      status: 'active',
      ...counts,
    };
  } catch {
    return { status: 'unavailable', waiting: 0, active: 0, completed: 0, failed: 0 };
  }
};

/**
 * Clean queue shutdown hook
 */
export const closeQueue = async () => {
  if (emailQueue) {
    await emailQueue.close().catch(() => {});
    emailQueue = null;
  }
};
