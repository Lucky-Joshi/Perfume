import api, { normalizeError } from './api';

export const newsletterAPI = {
  async subscribe(email) {
    try {
      const res = await api.post('/newsletter', { email });
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async unsubscribe(email) {
    try {
      const res = await api.post('/newsletter/unsubscribe', { email });
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  }
};

export default newsletterAPI;