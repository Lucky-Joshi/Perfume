import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

const ProductCard = memo(function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize);
  };

  return (
    <article
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          {!imageLoaded && <div className={styles.skeleton} />}
          <img
            src={product.image}
            alt={product.name}
            className={`${styles.image} ${imageLoaded ? styles.loaded : ''}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
          {product.badge && (
            <span className={styles.badge}>{product.badge}</span>
          )}
          <div className={`${styles.overlay} ${isHovered ? styles.overlayVisible : ''}`}>
            <button className={styles.quickView} onClick={handleAddToCart}>
              Quick Add
            </button>
          </div>
        </div>
      </Link>

      <div className={styles.info}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/product/${product.id}`} className={styles.nameLink}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        <p className={styles.description}>{product.description?.slice(0, 80)}...</p>

        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.round(product.rating) ? '#D4AF37' : 'none'} stroke="#D4AF37" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
          <span className={styles.ratingValue}>{product.rating}</span>
        </div>

        {product.sizes && product.sizes.length > 1 && (
          <div className={styles.sizes}>
            {product.sizes.map(size => (
              <button
                key={size}
                className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <div className={styles.bottom}>
          <div className={styles.priceWrap}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          </div>
          <button className={styles.addBtn} onClick={handleAddToCart}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
