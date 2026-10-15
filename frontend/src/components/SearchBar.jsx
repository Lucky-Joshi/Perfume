import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import styles from './SearchBar.module.css';

function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { products } = useProducts();

  const results = useMemo(() => {
    const lower = query.toLowerCase().trim();
    if (lower.length < 2) return [];
    return products
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower) ||
          (p.category || '').toLowerCase().includes(lower)
      )
      .slice(0, 8);
  }, [query, products]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSelect = (product) => {
    const categoryRoutes = { men: '/men', women: '/women', unisex: '/unisex' };
    navigate(categoryRoutes[product.category] || '/');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.searchContainer} onClick={e => e.stopPropagation()}>
        <div className={styles.searchInputWrap}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search perfumes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
          />
          <button onClick={onClose} className={styles.closeBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        {results.length > 0 && (
          <div className={styles.results}>
            {results.map(product => (
              <button
                key={product.id}
                className={styles.resultItem}
                onClick={() => handleSelect(product)}
              >
                <img src={product.image} alt={product.name} className={styles.resultImage} />
                <div className={styles.resultInfo}>
                  <span className={styles.resultName}>{product.name}</span>
                  <span className={styles.resultCategory}>{product.category}</span>
                </div>
                <span className={styles.resultPrice}>${product.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}
        {query.trim().length >= 2 && results.length === 0 && (
          <div className={styles.noResults}>No perfumes found for "{query}"</div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;