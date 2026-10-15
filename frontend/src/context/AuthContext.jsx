import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { getAccessToken, setRefreshToken, clearAuthTokens } from '../api/api';
import { authAPI } from '../api/authAPI';

const AuthContext = createContext();

const USER_KEY = 'ea_user';

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  const commitUser = useCallback((u) => {
    if (u) {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    setUser(u);
  }, []);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      if (!getAccessToken()) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        const res = await api.get('/user/me');
        if (mounted) commitUser(res.data?.data ?? res.data);
      } catch {
        if (mounted) commitUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    boot();

    const onUnauthorized = () => {
      clearAuthTokens();
      commitUser(null);
    };
    window.addEventListener('ea:unauthorized', onUnauthorized);
    return () => {
      mounted = false;
      window.removeEventListener('ea:unauthorized', onUnauthorized);
    };
  }, [commitUser]);

  const login = useCallback(
    async (credentials) => {
      const data = await authAPI.login(credentials);
      const sessionUser = data.user ?? data;
      commitUser(sessionUser);
      return data;
    },
    [commitUser]
  );

  const register = useCallback(async (payload) => {
    const data = await authAPI.register(payload);
    const sessionUser = data.user ?? data;
    commitUser(sessionUser);
    return data;
  }, [commitUser]);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      /* server session may already be gone */
    }
    setRefreshToken(null);
    clearAuthTokens();
    commitUser(null);
  }, [commitUser]);

  const updateUser = useCallback(
    (updates) => {
      setUser((prev) => {
        const next = { ...(prev || {}), ...updates };
        localStorage.setItem(USER_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const isAdmin = !!user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}