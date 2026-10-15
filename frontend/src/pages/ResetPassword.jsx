import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../api/authAPI';
import styles from './Auth.module.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Set New Password | Essence Aura';
    if (!token) {
      setFormError('This reset link is missing a token. Please request a new link.');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (formError) setFormError('');
  };

  const validate = (values) => {
    const errs = {};
    if (values.newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters';
    if (values.confirmPassword !== values.newPassword) errs.confirmPassword = 'Passwords do not match';
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
      await authAPI.resetPassword({ token, newPassword: form.newPassword });
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setFormError(err.message || 'Could not reset your password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>New Password</span>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.subtitle}>Choose a new password for your account.</p>
      </section>

      <div className={styles.wrap}>
        <div className={styles.card}>
          {done ? (
            <div className={styles.cardCenter}>
              <div className={styles.successIcon}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className={styles.cardTitle}>Password Updated</h2>
              <p className={styles.cardSub}>Your password has been reset. Redirecting you to login...</p>
            </div>
          ) : (
            <>
              <h2 className={styles.cardTitle}>Set a New Password</h2>
              <p className={styles.cardSub}>Must be at least 8 characters.</p>

              {formError && <div className={styles.formError}>{formError}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.field}>
                  <label htmlFor="newPassword" className={styles.label}>New Password *</label>
                  <input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    autoComplete="new-password"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
                  />
                  {errors.newPassword && <span className={styles.error}>{errors.newPassword}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="confirmPassword" className={styles.label}>Confirm Password *</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                  />
                  {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                </div>
                <button type="submit" className={styles.submit} disabled={submitting || !token}>
                  {submitting ? 'Saving...' : 'Update Password'}
                </button>
              </form>

              <div className={styles.altLinks}>
                <span className={styles.altLink}>
                  <Link to="/forgot-password">Request a new link</Link>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;