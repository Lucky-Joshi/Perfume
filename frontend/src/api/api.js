import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

const TOKEN_KEY = 'ea_access_token';
const REFRESH_KEY = 'ea_refresh_token';

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const setAccessToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

export const setRefreshToken = (token) => {
  if (token) sessionStorage.setItem(REFRESH_KEY, token);
  else sessionStorage.removeItem(REFRESH_KEY);
};

export const clearAuthTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
};

let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    const storedRefresh = sessionStorage.getItem(REFRESH_KEY);
    refreshPromise = api
      .post('/auth/refresh', storedRefresh ? { refreshToken: storedRefresh } : {})
      .then((res) => {
        const token = res.data?.data?.tokens?.accessToken || res.data?.data?.accessToken;
        setAccessToken(token);
        const nextRefresh = res.data?.data?.tokens?.refreshToken;
        if (nextRefresh) setRefreshToken(nextRefresh);
        return token;
      })
      .catch(() => {
        clearAuthTokens();
        window.dispatchEvent(new CustomEvent('ea:unauthorized'));
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config._retried) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status === 401 && !original._retried && !original.url.includes('/auth/')) {
      original._retried = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

export const APIError = class extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
};

export const normalizeError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong. Please try again.';
  return new APIError(message, error?.response?.status, error?.response?.data);
};

export default api;