import api, { normalizeError } from './api';

export const reviewsAPI = {
  async forProduct(productId, params = {}) {
    try {
      const res = await api.get(`/reviews/product/${productId}`, { params });
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async add(productId, { rating, comment }) {
    try {
      const res = await api.post(`/reviews/product/${productId}`, { rating, comment });
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  }
};

export default reviewsAPI;