import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authAPI } from '../api/authAPI';
import styles from './Auth.module.css';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [state, setState] = useState({ status: 'loading', message: '' });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!token) {
        if (!cancelled) setState({ status: 'error', message: 'Missing verification token.' });
        return;
      }
      try {
        const data = await authAPI.verifyEmail(token);
        if (!cancelled) {
          setState({
            status: 'success',
            message: data?.user?.email
              ? `Your email ${data.user.email} has been verified successfully.`
              : 'Your email has been verified successfully.'
          });
        }
      } catch (err) {
        if (!cancelled) setState({ status: 'error', message: err.message || 'Verification failed.' });
      }
    };
    run();
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    document.title = 'Email Verification | Essence Aura';
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Email Verification</span>
        <h1 className={styles.title}>Verify Your Email</h1>
        <p className={styles.subtitle}>Confirming your email address completes your Essence Aura account setup.</p>
      </section>

      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.cardCenter}>
            {state.status === 'loading' && (
              <>
                <div className={styles.successIcon} style={{ color: 'var(--color-accent)', background: 'rgba(212,175,55,0.12)' }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                </div>
                <h2 className={styles.cardTitle}>Verifying...</h2>
                <p className={styles.cardSub}>Please wait a moment while we confirm your email address.</p>
              </>
            )}

            {state.status === 'success' && (
              <>
                <div className={styles.successIcon}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>Email Verified</h2>
                <p className={styles.cardSub}>{state.message}</p>
                <Link to="/login" className={styles.submit} style={{ textAlign: 'center', textDecoration: 'none' }}>
                  Continue to Login
                </Link>
              </>
            )}

            {state.status === 'error' && (
              <>
                <div className={styles.successIcon} style={{ color: 'var(--color-error)', background: 'rgba(211,47,47,0.1)' }}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <h2 className={styles.cardTitle}>Verification Failed</h2>
                <p className={styles.cardSub}>{state.message}</p>
                <span className={styles.altLink}>
                  <Link to="/contact">Contact support</Link>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;