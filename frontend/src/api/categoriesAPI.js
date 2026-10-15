import api, { normalizeError } from './api';

export const categoriesAPI = {
  async list() {
    try {
      const res = await api.get('/categories');
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async create(data) {
    try {
      const res = await api.post('/categories', data);
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async update(id, data) {
    try {
      const res = await api.put(`/categories/${id}`, data);
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async remove(id) {
    try {
      const res = await api.delete(`/categories/${id}`);
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  }
};

export default categoriesAPI;