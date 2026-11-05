import { sendMail } from './mailTransport.js';
export const maybeSendContactEmail = data => sendMail({
  to: process.env.CONTACT_TO, replyTo: data.email, subject: 'New Cortexis contact message',
  text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || ''}\nSubject: ${data.subject || ''}\n\n${data.message}`,
});
