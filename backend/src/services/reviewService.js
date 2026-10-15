import AppError from '../utils/AppError.js';
import { paginate, totalPages } from '../utils/paginate.js';
import { reviewModel } from '../models/reviewModel.js';
import { productModel } from '../models/productModel.js';

export const reviewService = {
  async addReview(userId, { productId, rating, title, comment }) {
    const product = await productModel.findAdminById(productId);
    if (!product) throw new AppError('Product not found.', 404);

    const already = await reviewModel.hasReviewed(userId, productId);
    if (already) throw new AppError('You have already reviewed this product.', 409);

    const review = await reviewModel.create({
      product_id: productId,
      user_id: userId,
      rating: Math.min(5, Math.max(1, Number(rating))),
      title: title || '',
      comment: comment || ''
    });

    // Update aggregates from approved reviews only.
    await reviewModel.updateProductAggregates(productId);
    return review;
  },

  async listForProduct(productId, query = {}) {
    const { page = 1, limit = 5 } = query;
    const result = await reviewModel.findForProduct(productId, { page: Number(page), limit: Number(limit) });
    const { page: p, limit: l } = paginate(page, limit);
    return {
      reviews: result.data,
      meta: { total: result.count, page: p, limit: l, pages: totalPages(result.count, l) }
    };
  },

  async adminList(query = {}) {
    const { page = 1, limit = 10 } = query;
    const result = await reviewModel.findAll({
      page: Number(page),
      limit: Number(limit),
      status: query.status,
      search: query.search
    });
    const { page: p, limit: l } = paginate(page, limit);
    return {
      reviews: result.data,
      meta: { total: result.count, page: p, limit: l, pages: totalPages(result.count, l) }
    };
  },

  async moderate(id, status) {
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      throw new AppError('Invalid review status.', 400);
    }
    const review = await reviewModel.updateStatus(id, status);
    await reviewModel.updateProductAggregates(review.product_id);
    return review;
  },

  async delete(id) {
    await reviewModel.delete(id);
  }
};