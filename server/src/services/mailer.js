import nodemailer from 'nodemailer';


export const maybeSendContactEmail = async ({ name, email, phone, subject, message }) => {
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
// Email not configured; silently skip
return;
}


const transporter = nodemailer.createTransport({
host: SMTP_HOST,
port: Number(SMTP_PORT),
secure: Number(SMTP_PORT) === 465,
auth: { user: SMTP_USER, pass: SMTP_PASS },
});


const info = await transporter.sendMail({
from: `Dummy Company <${SMTP_USER}>`,
to: CONTACT_TO,
subject: subject ? `[Contact] ${subject}` : '[Contact] New message',
replyTo: email,
text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\n\n${message}`,
});


return info;
};