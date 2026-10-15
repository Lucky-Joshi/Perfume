import api, { normalizeError } from './api';
import { normalizeProduct } from './productsAPI';

export const cartAPI = {
  async get() {
    try {
      const res = await api.get('/cart');
      return (res.data?.data ?? res.data).map(normalizeProduct) ?? [];
    } catch (e) {
      if (e?.response?.status === 401) return [];
      throw normalizeError(e);
    }
  },

  async add({ productId, quantity = 1, size }) {
    try {
      const res = await api.post('/cart', { productId, quantity, size });
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async update(itemId, quantity) {
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity });
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async remove(itemId) {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async clear() {
    try {
      const res = await api.delete('/cart');
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  }
};

export default cartAPI;