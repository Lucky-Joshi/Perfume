import api, { normalizeError } from './api';
import { normalizeProduct } from './productsAPI';

export const wishlistAPI = {
  async get() {
    try {
      const res = await api.get('/wishlist');
      return (res.data?.data ?? res.data).map(normalizeProduct) ?? [];
    } catch (e) {
      if (e?.response?.status === 401) return [];
      throw normalizeError(e);
    }
  },

  async add(productId) {
    try {
      const res = await api.post(`/wishlist/${productId}`);
      return normalizeProduct(res.data?.data ?? res.data);
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async remove(productId) {
    try {
      const res = await api.delete(`/wishlist/${productId}`);
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  }
};

export default wishlistAPI;