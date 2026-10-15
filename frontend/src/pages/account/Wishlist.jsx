import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../../api/wishlistAPI';
import { useCart } from '../../context/CartContext';
import { formatMoney } from '../../utils/format';
import styles from './account.module.css';

function Wishlist() {
  const { addToCart, addToast } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await wishlistAPI.get();
      setItems(list || []);
    } catch (err) {
      setError(err.message || 'Could not load wishlist.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Wishlist | Essence Aura';
    load();
  }, [load]);

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      setItems((prev) => prev.filter((p) => String(p.id) !== String(productId)));
    } catch (err) {
      addToast(err.message || 'Could not update wishlist.', 'error');
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item, item.sizes?.[0]);
  };

  if (loading) return <div className={styles.empty}>Loading wishlist...</div>;
  if (error) return <div className={styles.empty}><p className={styles.fail}>{error}</p></div>;

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>My Wishlist</h2>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Your wishlist is empty</p>
          <p className={styles.emptyText}>Save items you love and they will appear here.</p>
          <Link to="/women" className={styles.btn} style={{ display: 'inline-block', textDecoration: 'none' }}>
            Discover Fragrances
          </Link>
        </div>
      ) : (
        <div className={styles.items}>
          {items.map((item) => (
            <div className={styles.item} key={item.id}>
              <img src={item.image} alt={item.name} className={styles.itemImage} />
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemMeta}>
                  {formatMoney(item.price)}
                  {item.originalPrice && (
                    <span style={{ textDecoration: 'line-through', marginLeft: 8, color: '#bdbdbd' }}>
                      {formatMoney(item.originalPrice)}
                    </span>
                  )}
                </p>
              </div>
              <button className={styles.wishlistAdd} style={{ marginRight: 10 }} onClick={() => handleAddToCart(item)}>
                Add to Cart
              </button>
              <button className={styles.wishlistAdd} onClick={() => handleRemove(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;