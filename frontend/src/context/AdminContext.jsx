import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { getAccessToken, clearAuthTokens } from '../api/api';
import { adminAPI } from '../api/adminAPI';

const AdminContext = createContext();
const ADMIN_KEY = 'ea_admin';

const readStoredAdmin = () => {
  try {
    const u = JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null');
    return u && u.role === 'admin' ? u : null;
  } catch {
    return null;
  }
};

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(readStoredAdmin);
  const [loading, setLoading] = useState(true);

  const commitAdmin = useCallback((u) => {
    if (u && u.role === 'admin') localStorage.setItem(ADMIN_KEY, JSON.stringify(u));
    else localStorage.removeItem(ADMIN_KEY);
    setAdmin(u && u.role === 'admin' ? u : null);
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
        const me = res.data?.data ?? res.data;
        if (mounted) commitAdmin(me?.role === 'admin' ? me : null);
      } catch {
        clearAuthTokens();
        if (mounted) commitAdmin(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    boot();

    const onUnauthorized = () => {
      clearAuthTokens();
      commitAdmin(null);
    };
    window.addEventListener('ea:unauthorized', onUnauthorized);
    return () => {
      mounted = false;
      window.removeEventListener('ea:unauthorized', onUnauthorized);
    };
  }, [commitAdmin]);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await adminAPI.login({ email, password });
      commitAdmin(data.user ?? data);
      return data;
    },
    [commitAdmin]
  );

  const logout = useCallback(async () => {
    try {
      await adminAPI.logout();
    } catch {
      /* ok */
    }
    clearAuthTokens();
    commitAdmin(null);
  }, [commitAdmin]);

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout, setAdmin: commitAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}