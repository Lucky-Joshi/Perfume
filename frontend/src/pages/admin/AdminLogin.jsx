import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { adminAPI } from '../../api/adminAPI';
import styles from './admin.module.css';

function AdminLogin() {
  const { login, admin } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Admin Login | Essence Aura';
    if (admin) navigate('/admin', { replace: true });
  }, [admin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const data = await login(form);
      const me = data.user ?? data;
      if (me?.role !== 'admin') {
        await adminAPI.logout();
        setError('This account does not have administrator access.');
        return;
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div style={{ minHeight: '100vh', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: 'var(--color-primary)' }}>
              Essence <span style={{ color: 'var(--color-accent)' }}>Aura</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-light)', marginTop: 6 }}>Admin Control Panel</p>
          </div>

          <div className={styles.card} style={{ padding: 32 }}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 6 }}>Sign In</h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-light)', marginBottom: 20 }}>
              Use your administrator credentials to continue.
            </p>

            {error && <div className={styles.message} style={{ color: 'var(--color-error)', background: 'rgba(198,40,40,0.08)', padding: 12, borderRadius: 4, marginBottom: 16 }}>{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@essenceaura.com"
                  className={styles.input}
                  style={{ width: '100%' }}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Password</label>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className={styles.input}
                  style={{ width: '100%' }}
                />
              </div>
              <button type="submit" className={styles.btn} style={{ width: '100%', background: 'var(--color-accent)' }} disabled={submitting}>
                {submitting ? 'Signing in...' : 'Login to Admin'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, marginTop: 18 }}>
            <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Back to storefront</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;