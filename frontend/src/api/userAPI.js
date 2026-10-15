import api, { normalizeError } from './api';

export const userAPI = {
  async me() {
    try {
      const res = await api.get('/user/me');
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async updateProfile(payload) {
    try {
      const res = await api.put('/user/me', payload);
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async changePassword(payload) {
    try {
      const res = await api.put('/user/me/password', payload);
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  }
};

export default userAPI;