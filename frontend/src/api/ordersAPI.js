import api, { normalizeError } from './api';

const unwrapList = (res) => ({ list: res.data?.data ?? res.data, meta: res.data?.meta ?? null });
const unwrap = (res) => res.data?.data ?? res.data;

export const ordersAPI = {
  async checkout(payload) {
    try {
      return unwrap(await api.post('/orders/checkout', payload));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async myOrders(params = {}) {
    try {
      return unwrapList(await api.get('/orders/my-orders', { params }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async getById(id) {
    try {
      return unwrap(await api.get(`/orders/my-orders/${id}`));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async cancel(id) {
    try {
      return unwrap(await api.post(`/orders/${id}/cancel`));
    } catch (e) {
      throw normalizeError(e);
    }
  }
};

export default ordersAPI;