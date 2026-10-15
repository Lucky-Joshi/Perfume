import { useState } from 'react';
import contactAPI from '../api/contactAPI';
import styles from './ContactForm.module.css';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
};

function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = (values) => {
    const errs = {};

    if (!values.name.trim()) {
      errs.name = 'Full name is required';
    } else if (values.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!values.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (values.phone && !/^[+()\-\s0-9]{7,15}$/.test(values.phone)) {
      errs.phone = 'Please enter a valid phone number';
    }

    if (!values.subject.trim()) {
      errs.subject = 'Subject is required';
    }

    if (!values.message.trim()) {
      errs.message = 'Message is required';
    } else if (values.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setSubmitting(true);
      setSubmitError('');
      try {
        await contactAPI.submit(form);
        setSubmitted(true);
        setForm(initialForm);
        setTimeout(() => setSubmitted(false), 5000);
      } catch (err) {
        setSubmitError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.wrap}>
      {submitted && (
        <div className={styles.success}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          Thank you! Your message has been sent successfully. Our team will respond within 24 hours.
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Full Name *</label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. John Anderson"
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        <div className={`${styles.field} ${styles.fieldRow}`}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
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
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +1 555 123 4567"
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
            />
            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="subject" className={styles.label}>Subject *</label>
          <input
            id="subject"
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="How can we help you?"
            className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
          />
          {errors.subject && <span className={styles.error}>{errors.subject}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>Message *</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            placeholder="Tell us more about your enquiry..."
            className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
          />
          {errors.message && <span className={styles.error}>{errors.message}</span>}
        </div>

        <button type="submit" className={styles.submit} disabled={submitting}>
          <span>{submitting ? 'Sending...' : 'Send Message'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>
    </div>
  );
}

export default ContactForm;