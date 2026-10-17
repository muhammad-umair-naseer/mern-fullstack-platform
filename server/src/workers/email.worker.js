import { Worker, UnrecoverableError } from 'bullmq';
import { sendVerificationCode } from '../services/verificationMail.js';
import { maybeSendContactEmail } from '../services/mailer.js';
import { alertAdmin, notifySignup } from '../services/adminAlert.js';

/**
 * BullMQ Email Worker
 * 
 * Processes background email and notification jobs.
 * Distinguishes between permanent SMTP failures (UnrecoverableError) and transient network failures (auto-retry).
 * Can be run in-process or as a standalone worker process.
 */

let emailWorker = null;

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

/**
 * Classifies whether an SMTP / network error is permanent (fail fast) or transient (retry).
 */
const handleSmtpError = (err, jobName) => {
  const code = err?.responseCode || err?.code;
  const message = err?.message || 'Unknown mail error';

  // 5xx SMTP response codes or invalid recipient envelope are permanent
  const isPermanent =
    (typeof code === 'number' && code >= 500 && code < 600) ||
    code === 'EENVELOPE' ||
    message.includes('Invalid login') ||
    message.includes('No recipients defined');

  if (isPermanent) {
    console.error(`❌ [EmailWorker] Permanent failure for job "${jobName}": ${message}. (Will NOT retry)`);
    throw new UnrecoverableError(`Permanent mail failure: ${message}`);
  }

  // Transient network / rate-limit errors (4xx, ETIMEDOUT, ECONNREFUSED) -> throw standard error to trigger retry
  console.warn(`⚠️ [EmailWorker] Transient error for job "${jobName}": ${message}. (Will retry with backoff)`);
  throw err;
};

export const processEmailJob = async (job) => {
  const { name, data } = job;

  switch (name) {
    case 'send-verification': {
      try {
        await sendVerificationCode(data);
        return { delivered: true, recipient: data.email };
      } catch (err) {
        handleSmtpError(err, name);
      }
      break;
    }

    case 'send-contact': {
      try {
        await maybeSendContactEmail(data);
        return { delivered: true, contactEmail: data.email };
      } catch (err) {
        handleSmtpError(err, name);
      }
      break;
    }

    case 'send-admin-alert': {
      try {
        await alertAdmin(data);
        return { alertSent: true, key: data.key };
      } catch (err) {
        handleSmtpError(err, name);
      }
      break;
    }

    case 'send-signup-notification': {
      try {
        await notifySignup(data);
        return { notified: true, user: data.email };
      } catch (err) {
        handleSmtpError(err, name);
      }
      break;
    }

    case 'send-internship-alert': {
      try {
        await alertAdmin({
          key: 'new-internship-application',
          subject: `New Internship Application: ${data.internshipTitle}`,
          detail: `Applicant: ${data.name} (${data.email}) applied for ${data.internshipTitle}`,
          context: { email: data.email, phone: data.phone, resume: data.resumeLink },
        });
        return { alertSent: true, applicant: data.email };
      } catch (err) {
        handleSmtpError(err, name);
      }
      break;
    }

    default:
      console.warn(`[EmailWorker] Unknown job name "${name}"`);
      return { skipped: true };
  }
};

export const initWorker = (concurrency = 2) => {
  if (emailWorker) return emailWorker;

  try {
    const connection = getRedisConnectionOptions();
    emailWorker = new Worker('emails', processEmailJob, {
      prefix: 'cortexis',
      connection,
      concurrency,
      lockDuration: 30000,
    });

    emailWorker.on('completed', (job) => {
      console.log(`✅ [EmailWorker] Completed job "${job.name}" (ID: ${job.id})`);
    });

    emailWorker.on('failed', (job, err) => {
      console.error(`❌ [EmailWorker] Failed job "${job?.name}" (ID: ${job?.id}): ${err.message}`);
    });

    emailWorker.on('error', (err) => {
      console.warn(`⚠️ [EmailWorker] Connection error: ${err.message}`);
    });

    console.log('⚡ BullMQ Email Worker initialized and listening');
    return emailWorker;
  } catch (err) {
    console.warn(`⚠️ Failed to start BullMQ Email Worker: ${err.message}`);
    return null;
  }
};

export const closeWorker = async () => {
  if (emailWorker) {
    console.log('[EmailWorker] Closing BullMQ worker...');
    await emailWorker.close();
    emailWorker = null;
  }
};

// --- Standalone CLI execution support ---
// Enables running `node src/workers/email.worker.js` as an independent microservice/container
if (process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  console.log('🚀 Starting Standalone BullMQ Email Worker Process...');
  initWorker(5);

  const shutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}, shutting down standalone worker...`);
    await closeWorker();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}
