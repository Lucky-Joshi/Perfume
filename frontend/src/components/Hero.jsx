import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bgOverlay}></div>
      <div className={styles.bgImage}></div>
      <div className={styles.content}>
        <div className={styles.tagline}>Established 2019</div>
        <h1 className={styles.title}>
          <span className={styles.titleLine}>Luxury in</span>
          <span className={styles.titleAccent}>Every Drop</span>
        </h1>
        <p className={styles.subtitle}>
          Discover our curated collection of exquisite fragrances crafted 
          from the world's finest ingredients. Each scent tells a story 
          of elegance and sophistication.
        </p>
        <div className={styles.actions}>
          <Link to="/men" className={styles.btnPrimary}>
            <span>Shop Collection</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <Link to="/gift-sets" className={styles.btnSecondary}>
            Explore Gift Sets
          </Link>
        </div>
      </div>
      <div className={styles.imageSection}>
        <div className={styles.imageWrapper}>
          <img 
            src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=1000&fit=crop" 
            alt="Signature perfume bottle" 
            className={styles.heroImage}
            loading="eager"
          />
          <div className={styles.imageFrame}></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
