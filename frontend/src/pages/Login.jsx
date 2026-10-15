import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: true });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || (location.search.includes('admin') ? '/admin' : '/account');

  useEffect(() => {
    document.title = 'Login | Essence Aura';
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (formError) setFormError('');
  };

  const validate = (values) => {
    const errs = {};
    if (!values.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = 'Enter a valid email';
    if (!values.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setFormError('');
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Welcome Back</span>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Access your account, track orders, and manage your collection.</p>
      </section>

      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.logoAccent}>&nbsp;</div>
          <h2 className={styles.cardTitle}>Sign In to Essence Aura</h2>
          <p className={styles.cardSub}>Use your email address to continue.</p>

          {formError && <div className={styles.formError}>{formError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email Address *</label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Password *</label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              />
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>

            <label className={styles.checkboxLine}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
              />
              <span className={styles.checkboxLabel}>Remember me for 7 days</span>
            </label>

            <button type="submit" className={styles.submit} disabled={submitting}>
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className={styles.divider}><span>or</span></div>

          <div className={styles.altLinks}>
            <span className={styles.altLink}>
              <Link to="/forgot-password">Forgot your password?</Link>
            </span>
            <span className={styles.altLink}>
              New to Essence Aura? <Link to="/register">Create an account</Link>
            </span>
            <span className={styles.altLink}>
              Admin? <Link to="/admin/login">Login to admin panel</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;