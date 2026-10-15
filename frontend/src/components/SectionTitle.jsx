import styles from './SectionTitle.module.css';

function SectionTitle({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <div className={`${styles.wrap} ${align === 'left' ? styles.left : styles.center}`}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <span className={styles.divider}></span>
    </div>
  );
}

export default SectionTitle;