import { sendMail } from './mailTransport.js';
export const alertAdmin = ({ subject, detail, context }) => sendMail({
  to: process.env.ADMIN_ALERT_TO || process.env.CONTACT_TO, subject: String(subject).replace(/[\r\n]/g, ' ').slice(0, 200),
  text: `${detail || ''}\n\n${JSON.stringify(context || {}, null, 2)}`,
});
export const notifySignup = ({ name, email }) => alertAdmin({ subject: 'New Cortexis signup', detail: `Name: ${name}\nEmail: ${email}` });
