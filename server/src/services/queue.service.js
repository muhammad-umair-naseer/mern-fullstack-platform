import { Queue } from 'bullmq';
import crypto from 'node:crypto';
import { redisOptions, queuePrefix } from '../config/redis.js';
import { isRedisReady } from './redis.service.js';
import { sendVerificationCode } from '../features/auth/verificationMail.js';
import { maybeSendContactEmail } from './mailer.js';
import { alertAdmin, notifySignup } from './adminAlert.js';

let emailQueue;
const encryptionKey = () => crypto.createHash('sha256').update(process.env.EMAIL_QUEUE_SECRET || process.env.JWT_SECRET || '').digest();
export function encryptJob(data) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
  return { v: 1, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), body: body.toString('base64') };
}
export function decryptJob(data) {
  if (data.v !== 1) throw new Error('Unsupported email job format; drain old jobs before upgrade');
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(data.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(data.tag, 'base64'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(data.body, 'base64')), decipher.final()]).toString('utf8'));
}
export const deliverEmail = (name, data) => {
  switch (name) {
    case 'send-verification': return sendVerificationCode(data);
    case 'send-contact': return maybeSendContactEmail(data);
    case 'send-admin-alert': return alertAdmin(data);
    case 'send-signup-notification': return notifySignup(data);
    case 'send-internship-alert': return alertAdmin({ subject: 'New internship application', detail: `Applicant: ${data.name} (${data.email})\nInternship: ${data.internshipTitle}`, context: { phone: data.phone, resume: data.resumeLink } });
    default: throw new Error('Unknown email job');
  }
};
export const getEmailQueue = () => {
  if (!isRedisReady()) return null;
  if (!emailQueue) {
    emailQueue = new Queue('emails', { prefix: queuePrefix(), connection: redisOptions(), defaultJobOptions: {
      attempts: 5, backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true, removeOnFail: { count: 500, age: 86400 },
    } });
    emailQueue.on('error', () => console.error('Email queue unavailable'));
  }
  return emailQueue;
};
async function dispatch(name, data) {
  const queue = getEmailQueue();
  if (queue) {
    // Opaque IDs and encrypted payloads keep verification codes/PII out of Redis diagnostics.
    const jobId = crypto.createHmac('sha256', encryptionKey()).update(JSON.stringify([name, data, Math.floor(Date.now() / 30000)])).digest('hex');
    await queue.add(name, encryptJob(data), { jobId });
    return { queued: true, sent: false };
  }
  await deliverEmail(name, data);
  return { queued: false, sent: true };
}
export const queueVerificationEmail = data => dispatch('send-verification', data);
export const queueContactEmail = data => dispatch('send-contact', data);
// Secondary notifications never change the result of an already persisted user action.
const notification = (name, data) => dispatch(name, data).catch(() => {
  console.error('Secondary email notification failed: ' + name);
  return { queued: false, sent: false };
});
export const queueAdminAlert = data => notification('send-admin-alert', data);
export const queueSignupNotification = data => notification('send-signup-notification', data);
export const queueInternshipAlert = data => notification('send-internship-alert', data);
export const getQueueMetrics = async () => {
  const queue = getEmailQueue();
  if (!queue) return { status: 'offline' };
  try { return { status: 'active', ...await queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed') }; }
  catch { return { status: 'unavailable' }; }
};
export const closeQueue = async () => { if (emailQueue) { await emailQueue.close(); emailQueue = null; } };
