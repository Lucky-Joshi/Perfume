import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found | Essence Aura';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'The page you are looking for could not be found.');
    }
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>This Scent Doesn't Exist</h1>
        <p className={styles.subtitle}>
          The page you're looking for has evaporated into thin air.
          Let's get you back to something beautiful.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primaryBtn}>Back to Home</Link>
          <Link to="/men" className={styles.secondaryBtn}>Shop Collection</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;