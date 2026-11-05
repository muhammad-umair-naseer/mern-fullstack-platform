import { sendMail, escapeHtml } from '../../services/mailTransport.js';
export { smtpReady } from '../../services/mailTransport.js';
export const sendVerificationCode = ({ name, email, code }) => sendMail({
  to: email, subject: 'Verify your Cortexis email',
  text: `Hello ${name}, your verification code is ${code}. It expires in 30 minutes. If you did not request this, ignore this email.`,
  html: `<p>Hello ${escapeHtml(name)},</p><p>Your verification code is <strong>${escapeHtml(code)}</strong>.</p><p>It expires in 30 minutes. If you did not request this, ignore this email.</p>`,
});
