import { useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import ContactForm from '../components/ContactForm';
import useScrollReveal from '../hooks/useScrollReveal';
import styles from './Contact.module.css';

const businessHours = [
  { day: 'Monday – Friday', hours: '9:00 AM – 8:00 PM' },
  { day: 'Saturday', hours: '10:00 AM – 6:00 PM' },
  { day: 'Sunday', hours: '12:00 PM – 5:00 PM' },
];

function Contact() {
  const formRef = useScrollReveal();

  useEffect(() => {
    document.title = 'Contact Us | Essence Aura';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Get in touch with Essence Aura. Visit our boutique, reach us by phone or email, or send us a message.');
    }
  }, []);

  return (
    <div className="page-wrapper">
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Get in Touch</span>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            We'd love to hear from you. Visit our boutique, give us a call, or send a message — our fragrance experts are here to help.
          </p>
        </div>
      </section>

      <section className={`section ${styles.infoSection}`}>
        <div className="container">
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <h3 className={styles.infoTitle}>Visit Our Boutique</h3>
              <p className={styles.infoText}>
                128 Madison Avenue<br/>
                Suite 400, New York, NY 10016<br/>
                United States
              </p>
            </div>

            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </span>
              <h3 className={styles.infoTitle}>Call Us</h3>
              <p className={styles.infoText}>
                <a href="tel:+12125550182" className={styles.link}>+1 (212) 555-0182</a><br/>
                <a href="tel:+12125550183" className={styles.link}>+1 (212) 555-0183</a>
              </p>
            </div>

            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <h3 className={styles.infoTitle}>Email Us</h3>
              <p className={styles.infoText}>
                <a href="mailto:hello@essenceaura.com" className={styles.link}>hello@essenceaura.com</a><br/>
                <a href="mailto:support@essenceaura.com" className={styles.link}>support@essenceaura.com</a>
              </p>
            </div>

            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </span>
              <h3 className={styles.infoTitle}>Business Hours</h3>
              <div className={styles.hours}>
                {businessHours.map(row => (
                  <div className={styles.hourRow} key={row.day}>
                    <span className={styles.hourDay}>{row.day}</span>
                    <span className={styles.hourTime}>{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.socialRow}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
              Facebook
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <section className={`section section--alt ${styles.formSection}`}>
        <div className="container">
          <SectionTitle
            eyebrow="Send a Message"
            title="We'd Love to Hear From You"
            subtitle="Fill out the form below and one of our fragrance specialists will respond within 24 hours."
          />
          <div ref={formRef} className={styles.formWrap}>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className={styles.mapSection}>
        <iframe
          title="Essence Aura Boutique Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.1787742040143!2d-74.0026819!3d40.7364389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bd5a1b6bc9%3A0x65d9c2a1f0c4b7f5!2sMadison%20Ave%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={styles.map}
        />
      </section>
    </div>
  );
}

export default Contact;