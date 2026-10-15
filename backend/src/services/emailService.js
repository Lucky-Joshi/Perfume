import { sendMail } from '../config/mailer.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

function layout(title, bodyHtml) {
  return `
  <div style="font-family:Poppins,Arial,sans-serif;background:#F8F5F0;padding:40px 16px;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #ece8e0;border-radius:8px;overflow:hidden;">
      <div style="background:#111111;padding:28px;text-align:center;">
        <h2 style="margin:0;color:#D4AF37;font-family:Georgia,serif;letter-spacing:2px;">ESSENCE AURA</h2>
        <p style="margin:6px 0 0;color:#888;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Luxury in Every Drop</p>
      </div>
      <div style="padding:32px;">
        <h3 style="margin:0 0 16px;color:#111111;font-family:Georgia,serif;">${title}</h3>
        ${bodyHtml}
      </div>
      <div style="background:#F8F5F0;padding:16px;text-align:center;color:#999;font-size:12px;">
        &copy; ${new Date().getFullYear()} Essence Aura. All rights reserved.
      </div>
    </div>
  </div>`;
}

export async function sendVerificationEmail(email, token) {
  const link = `${FRONTEND_URL}/verify-email?token=${token}`;
  return sendMail({
    to: email,
    subject: 'Verify your email — Essence Aura',
    html: layout(
      'Confirm your email',
      `<p>Welcome to Essence Aura! Confirm your email address to activate your account.</p>
       <p style="text-align:center;margin:28px 0;">
         <a href="${link}" style="background:#111111;color:#D4AF37;padding:14px 28px;text-decoration:none;font-size:13px;letter-spacing:1px;">Verify Email</a>
       </p>
       <p style="color:#777;font-size:13px;">Or copy this link: <br/><a href="${link}" style="color:#D4AF37;">${link}</a></p>`
    )
  });
}

export async function sendResetPasswordEmail(email, token) {
  const link = `${FRONTEND_URL}/reset-password?token=${token}`;
  return sendMail({
    to: email,
    subject: 'Reset your password — Essence Aura',
    html: layout(
      'Reset your password',
      `<p>We received a request to reset your password. Click below to choose a new one.</p>
       <p style="text-align:center;margin:28px 0;">
         <a href="${link}" style="background:#111111;color:#D4AF37;padding:14px 28px;text-decoration:none;font-size:13px;letter-spacing:1px;">Reset Password</a>
       </p>
       <p style="color:#777;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>`
    )
  });
}

export async function sendWelcomeEmail(email, firstName = '') {
  return sendMail({
    to: email,
    subject: 'Welcome to Essence Aura',
    html: layout(
      'Welcome to the family',
      `<p>Dear ${firstName || 'valued customer'},</p>
       <p>Your account is ready. Explore our collection of luxury fragrances, crafted with the finest ingredients from around the world.</p>`
    )
  });
}

export const emailService = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail
};