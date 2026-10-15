import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './CartDrawer.module.css';

function CartDrawer({ isOpen, onClose }) {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Shopping Cart ({cartItems.length})</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.empty}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p className={styles.emptyText}>Your cart is empty</p>
            <p className={styles.emptySub}>Discover our exquisite collection</p>
            <Link to="/men" className={styles.shopBtn} onClick={onClose}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {cartItems.map(item => (
                <div className={styles.item} key={`${item.id}-${item.size}`}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <span className={styles.itemSize}>{item.size}</span>
                    <div className={styles.quantityWrap}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.id, item.size)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <button className={styles.clearBtn} onClick={clearCart}>
                Clear Cart
              </button>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Subtotal</span>
                <span className={styles.totalValue}>${cartTotal.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className={styles.checkoutBtn} onClick={onClose}>
                Proceed to Checkout
              </Link>
              <Link to="/men" className={styles.continueBtn} onClick={onClose}>
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;