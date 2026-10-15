import { useState } from 'react';
import { Link } from 'react-router-dom';
import newsletterAPI from '../api/newsletterAPI';
import styles from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setStatus({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await newsletterAPI.subscribe(clean);
      setStatus({ type: 'success', text: res.already ? 'You are already subscribed.' : 'Subscribed successfully!' });
      setEmail('');
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Subscription failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.about}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}>EA</span>
              <div>
                <span className={styles.logoName}>Essence Aura</span>
                <span className={styles.logoTagline}>Luxury in Every Drop</span>
              </div>
            </Link>
            <p className={styles.aboutText}>
              Crafting extraordinary fragrances that celebrate individuality and luxury since 2019.
              Every bottle tells a story of passion, precision, and the pursuit of perfection.
            </p>
            <div className={styles.socials}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.linksSection}>
            <h4 className={styles.heading}>Quick Links</h4>
            <ul className={styles.links}>
              <li><Link to="/men">Men's Collection</Link></li>
              <li><Link to="/women">Women's Collection</Link></li>
              <li><Link to="/unisex">Unisex Collection</Link></li>
              <li><Link to="/gift-sets">Gift Sets</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className={styles.linksSection}>
            <h4 className={styles.heading}>Customer Care</h4>
            <ul className={styles.links}>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Returns & Exchanges</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className={styles.newsletter}>
            <h4 className={styles.heading}>Newsletter</h4>
            <p className={styles.newsletterText}>
              Subscribe for exclusive offers, new launches, and fragrance tips.
            </p>
            <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterBtn} disabled={submitting}>
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {status && (
              <p className={status.type === 'error' ? styles.newsletterError : styles.newsletterSuccess}>
                {status.text}
              </p>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Essence Aura. All rights reserved. Crafted with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
