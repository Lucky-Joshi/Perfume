import api, { normalizeError } from './api';

export const contactAPI = {
  async submit(payload) {
    try {
      const res = await api.post('/contact', payload);
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  }
};

export default contactAPI;