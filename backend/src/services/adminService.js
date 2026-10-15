import AppError from '../utils/AppError.js';
import { productModel } from '../models/productModel.js';
import { categoryModel } from '../models/categoryModel.js';
import { orderModel } from '../models/orderModel.js';
import { userModel } from '../models/userModel.js';
import { reviewModel } from '../models/reviewModel.js';
import { contactModel } from '../models/contactModel.js';
import { newsletterModel } from '../models/newsletterModel.js';
import { settingsModel, activityModel } from '../models/settingModel.js';
import { activityService } from './activityService.js';

export const adminService = {
  /**
   * Full dashboard aggregate used by /api/admin/dashboard.
   */
  async dashboard() {
    const [revenue, orderCount, productCount, userCount, pendingReviews, unreadMessages, subscriberCount] =
      await Promise.all([
        orderModel.totalRevenue(),
        orderModel.countAll(),
        productModel.countAll(),
        userModel.countAll(),
        reviewModel.countPending(),
        contactModel.countUnread(),
        newsletterModel.countAll()
      ]);

    const [recentOrders, recentUsers, latestReviews, activityLogs, revenueSeries] = await Promise.all([
      orderModel.findAll({ page: 1, limit: 5 }),
      userModel.findAll({ page: 1, limit: 5 }),
      reviewModel.findAll({ page: 1, limit: 5 }),
      activityModel.findAll({ limit: 10 }),
      orderModel.revenueLastDays(7)
    ]);

    return {
      stats: {
        revenue,
        orders: orderCount,
        products: productCount,
        customers: userCount,
        pendingReviews,
        unreadMessages,
        subscribers: subscriberCount
      },
      recentOrders: recentOrders.data,
      recentUsers: recentUsers.data.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        status: u.status,
        created_at: u.created_at,
        profile: u.profile || {}
      })),
      latestReviews: latestReviews.data,
      activityLogs,
      revenueSeries
    };
  },

  async getSettings() {
    return settingsModel.getAll();
  },

  async updateSettings(payload) {
    const allowedKeys = ['store_name', 'store_tagline', 'support_email', 'support_phone', 'currency', 'admin_notify_email'];
    for (const [key, value] of Object.entries(payload)) {
      if (allowedKeys.includes(key)) {
        await settingsModel.set(key, String(value ?? ''));
      }
    }
    return settingsModel.getAll();
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await userModel.findById(userId);
    const bcrypt = await import('bcrypt').then((m) => m.default);
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) throw new AppError('Current password is incorrect.', 401);

    const hash = await bcrypt.hash(newPassword, 12);
    await userModel.update(userId, { password_hash: hash, refresh_token: null });
    await activityService.log({ admin_id: userId, action: 'admin_password_changed', entity: 'admin', entity_id: userId });
    return true;
  }
};