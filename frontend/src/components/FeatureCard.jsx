import styles from './FeatureCard.module.css';

function FeatureCard({ icon, title, description }) {
  return (
    <article className={`${styles.card} fade-in`}>
      <div className={styles.iconWrap}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {icon}
        </svg>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </article>
  );
}

export default FeatureCard;