import nodemailer from 'nodemailer';
import { integer, isProduction } from '../config/environment.js';
export const smtpReady = () => ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'].every(key => Boolean(process.env[key])) && !/example\.com$/i.test(process.env.SMTP_HOST);
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
export async function sendMail(message) {
  if (!smtpReady()) throw Object.assign(new Error('Email delivery is not configured'), { code: 'SMTP_NOT_CONFIGURED' });
  const port = integer(process.env.SMTP_PORT, 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port, secure: port === 465, requireTLS: isProduction(),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, tls: { rejectUnauthorized: true },
    connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 15000,
    disableFileAccess: true, disableUrlAccess: true,
  });
  try {
    const result = await transport.sendMail({ from: { name: 'Cortexis', address: process.env.SMTP_FROM || process.env.SMTP_USER }, ...(process.env.SMTP_REPLY_TO ? { replyTo: process.env.SMTP_REPLY_TO } : {}), ...message });
    if (result.rejected?.length || !result.accepted?.length) throw new Error('SMTP did not accept the recipient');
    return { sent: true };
  } finally { transport.close(); }
}
