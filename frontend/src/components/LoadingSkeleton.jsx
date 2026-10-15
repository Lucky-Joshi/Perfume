import styles from './LoadingSkeleton.module.css';

function LoadingSkeleton({ count = 4 }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <div className={styles.card} key={i}>
          <div className={`${styles.block} ${styles.image}`}></div>
          <div className={`${styles.block} ${styles.lineShort}`}></div>
          <div className={`${styles.block} ${styles.lineTitle}`}></div>
          <div className={`${styles.block} ${styles.lineMedium}`}></div>
          <div className={styles.bottomRow}>
            <div className={`${styles.block} ${styles.price}`}></div>
            <div className={`${styles.block} ${styles.btn}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;