import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api/authAPI';
import styles from './Auth.module.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Reset Password | Essence Aura';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await authAPI.forgotPassword(clean);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Reset Password</span>
        <h1 className={styles.title}>Forgot Password</h1>
        <p className={styles.subtitle}>Enter your email and we'll send you a secure reset link.</p>
      </section>

      <div className={styles.wrap}>
        <div className={styles.card}>
          {sent ? (
            <div className={styles.cardCenter}>
              <div className={styles.successIcon}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className={styles.cardTitle}>Check Your Inbox</h2>
              <p className={styles.cardSub}>
                If an account exists for <strong>{email}</strong>, a password reset link has been sent. The link expires in 60 minutes.
              </p>
              <span className={styles.altLink}>
                <Link to="/login">Back to Login</Link>
              </span>
            </div>
          ) : (
            <>
              <h2 className={styles.cardTitle}>Request Reset Link</h2>
              <p className={styles.cardSub}>We'll email you a secure link to reset your password.</p>

              {error && <div className={styles.formError}>{error}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                    placeholder="e.g. john@example.com"
                    className={styles.input}
                  />
                </div>
                <button type="submit" className={styles.submit} disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className={styles.altLinks}>
                <span className={styles.altLink}>
                  Remembered your password? <Link to="/login">Login</Link>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;