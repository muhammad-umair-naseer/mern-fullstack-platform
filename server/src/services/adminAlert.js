import nodemailer from 'nodemailer';
import { smtpReady } from './verificationMail.js';

/**
 * Operational notifications to the site owner.
 *
 * Two kinds: something broke (alerts) and someone signed up (activity).
 * Both are fire-and-forget — an alert must never delay or fail the request
 * that triggered it, and a mail outage must not cascade into 500s.
 *
 * Rate limited on two axes, because the failure mode that most needs alerting
 * (SMTP down, database error on every request) is exactly the one that would
 * otherwise send thousands of emails: the same `key` repeats at most once per
 * window, and there is a hard hourly ceiling across all alerts.
 */

const REPEAT_WINDOW_MS = 15 * 60 * 1000;
const HOURLY_CAP = 20;

const lastSent = new Map();
let hourStart = Date.now();
let sentThisHour = 0;

const allowed = (key) => {
  const now = Date.now();

  if (now - hourStart > 60 * 60 * 1000) {
    hourStart = now;
    sentThisHour = 0;
  }
  if (sentThisHour >= HOURLY_CAP) return false;

  const previous = lastSent.get(key);
  if (previous && now - previous < REPEAT_WINDOW_MS) return false;

  lastSent.set(key, now);
  sentThisHour++;
  return true;
};

const recipient = () => process.env.ADMIN_ALERT_TO || process.env.CONTACT_TO;

const send = async ({ subject, html, text }) => {
  const to = recipient();
  if (!to || !smtpReady()) return { sent: false, reason: 'not-configured' };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"Cortexis Alerts" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
  return { sent: true };
};

/**
 * Something went wrong and you would want to know.
 * `key` groups repeats — use the failure type, not the affected user.
 */
export const alertAdmin = ({ key, subject, detail, context = {} }) => {
  if (!allowed(`alert:${key}`)) return;

  const rows = Object.entries({ ...context, at: new Date().toISOString() })
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#7286a5">${k}</td><td style="padding:4px 0;color:#0f2444"><code>${v}</code></td></tr>`)
    .join('');

  send({
    subject: `⚠️ Cortexis — ${subject}`,
    text: `${subject}\n\n${detail}\n\n${JSON.stringify(context, null, 2)}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#0f2444">
      <p style="font-size:12px;letter-spacing:.16em;color:#b07f24;margin:0 0 14px;font-weight:600">CORTEXIS · OPERATIONAL ALERT</p>
      <h2 style="margin:0 0 10px;font-size:18px">${subject}</h2>
      <p style="color:#46587a;line-height:1.6;margin:0 0 18px">${detail}</p>
      <table style="font-size:13px;border-collapse:collapse">${rows}</table>
      <p style="color:#7286a5;font-size:12px;margin-top:20px">
        Repeats of this alert are suppressed for 15 minutes.
      </p>
    </div>`,
  }).catch((err) => console.error('admin alert failed:', err.message));
};

/** A new learner registered. Capped by the same hourly ceiling. */
export const notifySignup = ({ name, email }) => {
  // Keyed per-address so a genuine burst of signups still comes through,
  // while a retry loop on one address does not.
  if (!allowed(`signup:${email}`)) return;

  send({
    subject: `New Cortexis signup — ${name}`,
    text: `${name} <${email}> registered at ${new Date().toISOString()}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#0f2444">
      <p style="font-size:12px;letter-spacing:.16em;color:#b07f24;margin:0 0 14px;font-weight:600">CORTEXIS · NEW SIGNUP</p>
      <h2 style="margin:0 0 10px;font-size:18px">${name}</h2>
      <p style="color:#46587a;margin:0 0 6px">${email}</p>
      <p style="color:#7286a5;font-size:12px">${new Date().toUTCString()} — awaiting email verification</p>
    </div>`,
  }).catch((err) => console.error('signup notification failed:', err.message));
};
