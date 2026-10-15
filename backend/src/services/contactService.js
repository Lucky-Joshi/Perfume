import AppError from '../utils/AppError.js';
import { sanitizeEmail, sanitizeText } from '../utils/sanitize.js';
import { paginate, totalPages } from '../utils/paginate.js';
import { contactModel } from '../models/contactModel.js';

export const contactService = {
  async submit({ name, email, phone, subject, message }) {
    const row = await contactModel.create({
      name: sanitizeText(name),
      email: sanitizeEmail(email),
      phone: sanitizeText(phone || ''),
      subject: sanitizeText(subject),
      message: sanitizeText(message)
    });
    return row;
  },

  async adminList(query = {}) {
    const { page = 1, limit = 10 } = query;
    const result = await contactModel.findAll({
      page: Number(page),
      limit: Number(limit),
      is_read: query.is_read
    });
    const { page: p, limit: l } = paginate(page, limit);
    return {
      messages: result.data,
      meta: { total: result.count, page: p, limit: l, pages: totalPages(result.count, l) }
    };
  },

  async markRead(id) {
    const row = await contactModel.markRead(id);
    if (!row) throw new AppError('Message not found.', 404);
    return row;
  },

  async delete(id) {
    await contactModel.delete(id);
  }
};