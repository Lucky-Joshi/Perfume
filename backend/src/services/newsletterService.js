import { sanitizeEmail } from '../utils/sanitize.js';
import { paginate, totalPages } from '../utils/paginate.js';
import { newsletterModel } from '../models/newsletterModel.js';

export const newsletterService = {
  async subscribe(email) {
    const clean = sanitizeEmail(email);
    const existing = await newsletterModel.findByEmail(clean);
    if (existing) return { subscribed: true, already: true };

    await newsletterModel.create(clean);
    return { subscribed: true, already: false };
  },

  async adminList(query = {}) {
    const { page = 1, limit = 15 } = query;
    const result = await newsletterModel.findAll({ page: Number(page), limit: Number(limit) });
    const { page: p, limit: l } = paginate(page, limit);
    return {
      subscribers: result.data,
      meta: { total: result.count, page: p, limit: l, pages: totalPages(result.count, l) }
    };
  },

  async adminDelete(id) {
    await newsletterModel.remove(id);
  },

  async unsubscribe(email) {
    await newsletterModel.unsubscribe(sanitizeEmail(email));
  }
};