import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';
import { paginate, totalPages } from '../utils/paginate.js';
import { userModel, profileModel } from '../models/userModel.js';

const SALT_ROUNDS = 12;

export const userService = {
  async getProfile(userId) {
    const user = await userModel.findById(userId);
    if (!user) throw new AppError('User not found.', 404);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      email_verified: user.email_verified,
      created_at: user.created_at,
      profile: user.profile || {}
    };
  },

  async updateProfile(userId, payload) {
    const user = await userModel.findById(userId);
    if (!user) throw new AppError('User not found.', 404);

    await profileModel.update(userId, {
      first_name: payload.first_name ?? user.profile?.first_name ?? '',
      last_name: payload.last_name ?? user.profile?.last_name ?? '',
      phone: payload.phone ?? user.profile?.phone ?? '',
      address: payload.address ?? user.profile?.address ?? '',
      city: payload.city ?? user.profile?.city ?? '',
      country: payload.country ?? user.profile?.country ?? ''
    });

    if (payload.email && payload.email !== user.email) {
      const existing = await userModel.findByEmail(payload.email);
      if (existing) throw new AppError('That email is already in use.', 409);
      await userModel.update(userId, { email: payload.email.toLowerCase().trim() });
    }

    return this.getProfile(userId);
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await userModel.findById(userId);

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) throw new AppError('Current password is incorrect.', 401);

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await userModel.update(userId, { password_hash: hash, refresh_token: null });
    return true;
  },

  async adminList(query = {}) {
    const { page = 1, limit = 10 } = query;
    const result = await userModel.findAll({
      page: Number(page),
      limit: Number(limit),
      search: query.search,
      status: query.status
    });
    const { page: p, limit: l } = paginate(page, limit);
    return {
      users: result.data.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        status: u.status,
        email_verified: u.email_verified,
        created_at: u.created_at,
        profile: u.profile || {}
      })),
      meta: { total: result.count, page: p, limit: l, pages: totalPages(result.count, l) }
    };
  },

  async adminUpdateStatus(userId, status) {
    if (!['active', 'suspended'].includes(status)) throw new AppError('Invalid user status.', 400);
    const user = await userModel.findById(userId);
    if (!user) throw new AppError('User not found.', 404);
    await userModel.update(userId, { status });
    return { id: user.id, status };
  },

  async adminUpdateRole(userId, role) {
    if (!['user', 'admin'].includes(role)) throw new AppError('Invalid role.', 400);
    const user = await userModel.findById(userId);
    if (!user) throw new AppError('User not found.', 404);
    await userModel.update(userId, { role });
    return { id: user.id, role };
  },

  async adminDelete(userId) {
    await userModel.deleteById(userId);
  }
};