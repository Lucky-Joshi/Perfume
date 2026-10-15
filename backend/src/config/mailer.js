import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.EMAIL_PORT || 2525),
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

/**
 * Send an email. Never throws for dev environments — it logs instead,
 * so the API keeps working when SMTP is not configured.
 */
export async function sendMail({ to, subject, html, text = '' }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Essence Aura <no-reply@essenceaura.com>',
      to,
      subject,
      text,
      html
    });
    console.log(`[email] sent to ${to} :: ${subject} (${info.messageId})`);
    return info;
  } catch (err) {
    console.error('[email] failed to send:', err.message);
    return null;
  }
}

export { transporter };