import api, { setAccessToken, setRefreshToken, clearAuthTokens, normalizeError } from './api';

export const authAPI = {
  async register(payload) {
    try {
      const res = await api.post('/auth/register', payload);
      const data = res.data?.data ?? res.data;
      setAccessToken(data?.tokens?.accessToken);
      setRefreshToken(data?.tokens?.refreshToken);
      return data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async login({ email, password, rememberMe }) {
    try {
      const res = await api.post('/auth/login', { email, password, rememberMe: !!rememberMe });
      const data = res.data?.data ?? res.data;
      setAccessToken(data?.tokens?.accessToken);
      setRefreshToken(data?.tokens?.refreshToken);
      return data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async refresh() {
    try {
      const res = await api.post('/auth/refresh');
      const data = res.data?.data ?? res.data;
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

  async verifyEmail(token) {
    try {
      const res = await api.get('/auth/verify-email', { params: { token } });
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async forgotPassword(email) {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async resetPassword({ token, newPassword }) {
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword });
      return res.data?.data ?? res.data;
    } catch (e) {
      throw normalizeError(e);
    }
  }
};

export default authAPI;