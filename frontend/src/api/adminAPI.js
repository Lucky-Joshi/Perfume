import api, { setAccessToken, setRefreshToken, clearAuthTokens, normalizeError } from './api';

const unwrapList = (res) => ({ list: res.data?.data ?? res.data, meta: res.data?.meta ?? null });
const unwrap = (res) => res.data?.data ?? res.data;

export const adminAPI = {
  async login({ email, password }) {
    try {
      const res = await api.post('/admin/login', { email, password });
      const data = unwrap(res);
      setAccessToken(data?.tokens?.accessToken);
      setRefreshToken(data?.tokens?.refreshToken);
      return data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuthTokens();
    }
  },

  async me() {
    try {
      return unwrap(await api.get('/admin/me'));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async updatePassword(payload) {
    try {
      return unwrap(await api.put('/admin/password', payload));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async dashboard() {
    try {
      return unwrap(await api.get('/admin/dashboard'));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async listProducts(params = {}) {
    try {
      return unwrapList(await api.get('/admin/products', { params }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  buildProductPayload(data, imageFiles = []) {
    if (imageFiles && imageFiles.length) {
      const fd = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        fd.append(key, Array.isArray(value) ? JSON.stringify(value) : String(value));
      });
      imageFiles.forEach((file) => fd.append('images', file));
      return { body: fd, headers: { 'Content-Type': 'multipart/form-data' } };
    }
    return { body: data, headers: { 'Content-Type': 'application/json' } };
  },

  async createProduct(data, imageFiles = []) {
    try {
      const { body, headers } = this.buildProductPayload(data, imageFiles);
      return unwrap(await api.post('/admin/products', body, { headers }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async updateProduct(id, data, imageFiles = []) {
    try {
      const { body, headers } = this.buildProductPayload(data, imageFiles);
      return unwrap(await api.put(`/admin/products/${id}`, body, { headers }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async deleteProduct(id) {
    try {
      return unwrap(await api.delete(`/admin/products/${id}`));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async listCategories() {
    try {
      const res = await api.get('/admin/categories');
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async createCategory(data) {
    try {
      return unwrap(await api.post('/admin/categories', data));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async updateCategory(id, data) {
    try {
      return unwrap(await api.put(`/admin/categories/${id}`, data));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async deleteCategory(id) {
    try {
      return unwrap(await api.delete(`/admin/categories/${id}`));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async listOrders(params = {}) {
    try {
      return unwrapList(await api.get('/admin/orders', { params }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async updateOrderStatus(id, status) {
    try {
      return unwrap(await api.put(`/admin/orders/${id}/status`, { status }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async listUsers(params = {}) {
    try {
      return unwrapList(await api.get('/admin/users', { params }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async updateUserStatus(id, status) {
    try {
      return unwrap(await api.patch(`/admin/users/${id}/status`, { status }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async updateUserRole(id, role) {
    try {
      return unwrap(await api.patch(`/admin/users/${id}/role`, { role }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async deleteUser(id) {
    try {
      return unwrap(await api.delete(`/admin/users/${id}`));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async listReviews(params = {}) {
    try {
      return unwrapList(await api.get('/admin/reviews', { params }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async moderateReview(id, status) {
    try {
      return unwrap(await api.put(`/admin/reviews/${id}/status`, { status }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async deleteReview(id) {
    try {
      return unwrap(await api.delete(`/admin/reviews/${id}`));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async listMessages(params = {}) {
    try {
      return unwrapList(await api.get('/admin/messages', { params }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async markMessageRead(id, read = true) {
    try {
      return unwrap(await api.patch(`/admin/messages/${id}/read`, { read }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async deleteMessage(id) {
    try {
      return unwrap(await api.delete(`/admin/messages/${id}`));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async listNewsletter(params = {}) {
    try {
      return unwrapList(await api.get('/admin/newsletter', { params }));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async deleteSubscriber(id) {
    try {
      return unwrap(await api.delete(`/admin/newsletter/${id}`));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async getSettings() {
    try {
      return unwrap(await api.get('/admin/settings'));
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async updateSettings(payload) {
    try {
      return unwrap(await api.put('/admin/settings', payload));
    } catch (e) {
      throw normalizeError(e);
    }
  }
};

export default adminAPI;