import { Worker, UnrecoverableError } from 'bullmq';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { redisOptions, queuePrefix } from '../config/redis.js';
import { validateEnvironment } from '../config/environment.js';
import { deliverEmail, decryptJob } from '../services/queue.service.js';
let emailWorker;
export async function processEmailJob(job) {
  try {
    const data = decryptJob(job.data);
    const result = await deliverEmail(job.name, data);
    if (!result?.sent) throw new Error('Email was not accepted by SMTP');
    return { delivered: true };
  } catch (err) {
    const permanent = (err.responseCode >= 500 && err.responseCode < 600) || ['EENVELOPE', 'EAUTH', 'SMTP_NOT_CONFIGURED'].includes(err.code);
    if (permanent) throw new UnrecoverableError('Permanent email delivery failure');
    throw new Error('Email delivery failed; retry scheduled');
  }
}
export const initWorker = (concurrency = 2) => {
  if (emailWorker) return emailWorker;
  emailWorker = new Worker('emails', processEmailJob, { prefix: queuePrefix(), connection: redisOptions({ blocking: true }), concurrency, lockDuration: 30000 });
  emailWorker.on('failed', () => console.error('Email job failed; inspect queue counts'));
  emailWorker.on('error', () => console.error('Email worker connection failed'));
  return emailWorker;
};
export const closeWorker = async () => { if (emailWorker) { await emailWorker.close(); emailWorker = null; } };
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  validateEnvironment({ worker: true });
  initWorker(2);
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { await closeWorker(); process.exit(0); });
}
