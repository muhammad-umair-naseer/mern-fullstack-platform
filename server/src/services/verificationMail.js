import nodemailer from 'nodemailer';

const isConfigured = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  // A placeholder host is worse than no host: it makes the app look configured
  // while every send fails, so treat example.com as unconfigured.
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && !/example\.com$/i.test(SMTP_HOST));
};

const transporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

const html = (name, code) => `
  <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#0f2444">
    <p style="font-size:13px;letter-spacing:.18em;color:#b07f24;margin:0 0 18px;font-weight:600">
      CORTEXIS SOLUTION HUB PVT LTD
    </p>
    <h1 style="font-size:22px;margin:0 0 14px">Confirm your email</h1>
    <p style="color:#46587a;line-height:1.6;margin:0 0 22px">
      Hi ${name}, use this code to finish setting up your account and start learning.
    </p>
    <p style="font-size:34px;font-weight:700;letter-spacing:.28em;background:#f2f6fb;
              border:1px solid #d7e6f5;border-radius:10px;padding:18px;text-align:center;margin:0 0 22px">
      ${code}
    </p>
    <p style="color:#7286a5;font-size:13px;line-height:1.6;margin:0">
      The code expires in 30 minutes. If you did not create an account, you can ignore this email.
    </p>
  </div>`;

/**
 * Emails a verification code. Returns { sent, reason }.
 *
 * When SMTP is not configured the code is printed to the server log instead of
 * throwing, so the flow stays testable before real credentials are in place.
 * The caller must never expose the code over HTTP.
 */
export const sendVerificationCode = async ({ name, email, code }) => {
  if (!isConfigured()) {
    console.log(
      `\n📧 [SMTP not configured] verification code for ${email}: ${code}\n` +
        `   Set SMTP_HOST/PORT/USER/PASS in server/.env to send this by email.\n`
    );
    return { sent: false, reason: 'smtp-not-configured' };
  }

  try {
    await transporter().sendMail({
      from: `"Cortexis Solution Hub" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `${code} is your Cortexis verification code`,
      text: `Hi ${name}, your Cortexis verification code is ${code}. It expires in 30 minutes.`,
      html: html(name, code),
    });
    return { sent: true };
  } catch (err) {
    // Log the code as a fallback so a delivery outage cannot lock people out.
    console.error(`❌ Could not email ${email}: ${err.message}`);
    console.log(`📧 Fallback — verification code for ${email}: ${code}`);
    return { sent: false, reason: 'send-failed' };
  }
};

export const smtpReady = isConfigured;
