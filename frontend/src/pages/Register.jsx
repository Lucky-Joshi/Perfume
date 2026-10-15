import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Create Account | Essence Aura';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (formError) setFormError('');
  };

  const validate = (values) => {
    const errs = {};
    if (!values.first_name.trim()) errs.first_name = 'First name is required';
    if (!values.last_name.trim()) errs.last_name = 'Last name is required';
    if (!values.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = 'Enter a valid email';
    if (values.phone && !/^[+()\-\s0-9]{7,15}$/.test(values.phone)) errs.phone = 'Enter a valid phone';
    if (values.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (values.confirmPassword !== values.password) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setFormError('');
    setFormSuccess('');
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      setFormSuccess('Account created! Please check your email to verify your address.');
      setTimeout(() => navigate('/account', { replace: true }), 1800);
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Join Us</span>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Become part of the Essence Aura family and enjoy a world of fragrance.</p>
      </section>

      <div className={styles.wrap}>
        <div className={styles.card} style={{ maxWidth: 500 }}>
          <h2 className={styles.cardTitle}>Create Your Account</h2>
          <p className={styles.cardSub}>It takes less than a minute to join.</p>

          {formError && <div className={styles.formError}>{formError}</div>}
          {formSuccess && <div className={styles.formSuccess}>{formSuccess}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className={`${styles.field} ${styles.row}`}>
              <div className={styles.field}>
                <label htmlFor="first_name" className={styles.label}>First Name *</label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  autoComplete="given-name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  className={`${styles.input} ${errors.first_name ? styles.inputError : ''}`}
                />
                {errors.first_name && <span className={styles.error}>{errors.first_name}</span>}
              </div>
              <div className={styles.field}>
                <label htmlFor="last_name" className={styles.label}>Last Name *</label>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  autoComplete="family-name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Anderson"
                  className={`${styles.input} ${errors.last_name ? styles.inputError : ''}`}
                />
                {errors.last_name && <span className={styles.error}>{errors.last_name}</span>}
              </div>
            </div>

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
              <label htmlFor="phone" className={styles.label}>Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +1 555 123 4567"
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              />
              {errors.phone && <span className={styles.error}>{errors.phone}</span>}
            </div>

            <div className={`${styles.field} ${styles.row}`}>
              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>Password *</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                />
                {errors.password && <span className={styles.error}>{errors.password}</span>}
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
            </div>

            <button type="submit" className={styles.submit} disabled={submitting}>
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className={styles.divider}><span>or</span></div>

          <div className={styles.altLinks}>
            <span className={styles.altLink}>
              Already have an account? <Link to="/login">Login here</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;