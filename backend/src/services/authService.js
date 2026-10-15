import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../utils/AppError.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { sanitizeEmail } from '../utils/sanitize.js';
import { userModel, profileModel } from '../models/userModel.js';
import { emailService } from './emailService.js';

const SALT_ROUNDS = 12;

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    email_verified: user.email_verified,
    status: user.status,
    profile: user.profile || null
  };
}

export const authService = {
  async register({ email, password, first_name, last_name, phone }) {
    const cleanEmail = sanitizeEmail(email);
    const existing = await userModel.findByEmail(cleanEmail);
    if (existing) {
      throw new AppError('An account with this email already exists.', 409);
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const emailToken = uuidv4();

    const user = await userModel.create({
      email: cleanEmail,
      password_hash,
      role: 'user',
      email_verified: false,
      verify_token: emailToken
    });

    await profileModel.create({
      userId: user.id,
      first_name: first_name || '',
      last_name: last_name || '',
      phone: phone || '',
      address: '',
      city: '',
      country: ''
    });

    await emailService.sendVerificationEmail(cleanEmail, emailToken);
    await emailService.sendWelcomeEmail(cleanEmail, first_name);

    const tokens = generateTokens(user);
    return { user: toPublicUser(await userModel.findById(user.id)), tokens };
  },

  async verifyEmail(token) {
    if (!token) throw new AppError('Verification token is required.', 400);

    // Look up the user by stored verify_token.
    const { supabase } = await import('../config/supabase.js');
    const { data: user, error: dbErr } = await supabase
      .from('users')
      .select('*')
      .eq('verify_token', token)
      .maybeSingle();

    if (dbErr) throw dbErr;
    if (!user) throw new AppError('Invalid or expired verification link.', 400);

    await userModel.update(user.id, { email_verified: true, verify_token: null });
    return toPublicUser(await userModel.findById(user.id));
  },

  async login({ email, password, rememberMe = false }) {
    const cleanEmail = sanitizeEmail(email);
    const user = await userModel.findByEmail(cleanEmail);
    if (!user) throw new AppError('Invalid email or password.', 401);

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new AppError('Invalid email or password.', 401);

    if (user.status === 'suspended') {
      throw new AppError('Your account has been suspended. Contact support.', 403);
    }

    const tokens = generateTokens(user);
    await userModel.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: toPublicUser(await userModel.findById(user.id)),
      tokens,
      rememberMe
    };
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw new AppError('Refresh token is required.', 401);

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid refresh token.', 401);
    }

    const { supabase } = await import('../config/supabase.js');
    const { data: revoked, error: blErr } = await supabase
      .from('token_blacklist')
      .select('token')
      .eq('token', refreshToken)
      .maybeSingle();
    if (blErr) throw blErr;
    if (revoked) throw new AppError('Refresh token has been revoked.', 401);

    const user = await userModel.findById(payload.sub);
    if (!user) throw new AppError('User no longer exists.', 401);
    if (user.refresh_token !== refreshToken) {
      throw new AppError('Refresh token has been revoked.', 401);
    }

    const tokens = generateTokens(user);
    await userModel.updateRefreshToken(user.id, tokens.refreshToken);
    return { user: toPublicUser(user), tokens };
  },

  async logout(userId, refreshToken) {
    if (refreshToken) {
      const { supabase } = await import('../config/supabase.js');
      await supabase.from('token_blacklist').upsert({ token: refreshToken, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });
    }
    if (userId) {
      const user = await userModel.findById(userId);
      if (user?.refresh_token) await userModel.updateRefreshToken(userId, null);
    }
    return true;
  },

  async forgotPassword(email) {
    const cleanEmail = sanitizeEmail(email);
    const user = await userModel.findByEmail(cleanEmail);
    // Always respond identically to avoid user enumeration.
    if (!user) return false;

    const token = uuidv4();
    await userModel.update(user.id, {
      reset_password_token: token,
      reset_password_expires: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    });

    await emailService.sendResetPasswordEmail(cleanEmail, token);
    return true;
  },

  async resetPassword({ token, newPassword }) {
    if (!token) throw new AppError('Reset token is required.', 400);

    const { supabase } = await import('../config/supabase.js');
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('reset_password_token', token)
      .maybeSingle();
    if (error) throw error;

    if (!user) throw new AppError('Invalid or expired reset link.', 400);

    const expires = user.reset_password_expires ? new Date(user.reset_password_expires).getTime() : 0;
    if (expires < Date.now()) {
      throw new AppError('Reset link has expired. Request a new one.', 400);
    }

    const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await userModel.update(user.id, {
      password_hash,
      reset_password_token: null,
      reset_password_expires: null,
      refresh_token: null
    });

    return true;
  }
};

export { toPublicUser };