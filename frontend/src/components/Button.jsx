import styles from './Button.module.css';

function Button({ children, onClick, variant = 'submit', type = 'button', disabled = false, className = '' }) {
  const variantClass = variant === 'primary'
    ? styles.primary
    : variant === 'secondary'
      ? styles.secondary
      : variant === 'gold'
        ? styles.gold
        : styles.submit;

  return (
    <button
      type={type}
      className={`${styles.btn} ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.content}>{children}</span>
    </button>
  );
}

export default Button;