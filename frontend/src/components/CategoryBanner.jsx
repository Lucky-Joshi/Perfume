import { Link } from 'react-router-dom';
import styles from './CategoryBanner.module.css';

function CategoryBanner({ eyebrow, title, subtitle, image, link, btnText = 'Shop Collection' }) {
  const isAnchor = link && link.startsWith('#');

  return (
    <section className={styles.banner}>
      <div className={styles.imageWrap}>
        <img src={image} alt={title} className={styles.image} loading="lazy" />
        <div className={styles.overlay}></div>
      </div>
      <div className={styles.content}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {isAnchor ? (
          <a href={link} className={styles.btn}>
            {btnText}
          </a>
        ) : (
          <Link to={link} className={styles.btn}>
            {btnText}
          </Link>
        )}
      </div>
    </section>
  );
}

export default CategoryBanner;