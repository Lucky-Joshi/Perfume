import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api/ordersAPI';
import { formatMoney } from '../utils/format';
import styles from './account/account.module.css';

function Checkout() {
  const { cartItems, cartTotal, clearCart, addToast } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: '',
    city: '',
    country: 'United States',
    zip: '',
    paymentMethod: 'cod',
    name: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    document.title = 'Checkout | Essence Aura';
    if (user?.profile) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || `${user.profile.first_name || ''} ${user.profile.last_name || ''}`.trim(),
        address: prev.address || user.profile.address || '',
        city: prev.city || user.profile.city || '',
        country: prev.country || user.profile.country || 'United States'
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (values) => {
    const errs = {};
    if (!values.address.trim()) errs.address = 'Shipping address is required';
    if (!values.city.trim()) errs.city = 'City is required';
    if (!values.country.trim()) errs.country = 'Country is required';
    if (values.paymentMethod === 'card') {
      if (!values.name.trim()) errs.name = 'Cardholder name is required';
      if (!/^\d{13,19}$/.test(values.cardNumber.replace(/\s/g, ''))) errs.cardNumber = 'Enter a valid card number';
      if (!/^\d{2}\/\d{2}$/.test(values.cardExpiry)) errs.cardExpiry = 'MM/YY';
      if (!/^\d{3,4}$/.test(values.cardCvc)) errs.cardCvc = 'CVC';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const result = await ordersAPI.checkout({
        shipping: {
          address: form.address,
          city: form.city,
          country: form.country,
          cost: cartTotal >= 150 ? 0 : 12
        },
        payment: {
          method: form.paymentMethod,
          discount: 0
        }
      });
      clearCart();
      setPlacedOrder(result);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      addToast(err.message || 'Could not place order.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className={styles.page} style={{ paddingTop: 'var(--nav-height)', background: 'white' }}>
        <div className="container" style={{ padding: '80px 24px', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div className={styles.empty}>
            <div className={styles.successIcon} style={{
              width: 72, height: 72, margin: '0 auto', borderRadius: '50%',
              background: 'rgba(45,138,78,0.12)', color: 'var(--color-success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 30, marginTop: 20 }}>Thank You!</h2>
            <p className={styles.emptyText}>
              Your order <strong>{placedOrder.order?.id}</strong> has been placed successfully.
              We'll notify you as soon as it ships.
            </p>
            <Link to="/account/orders" className={styles.btn} style={{ display: 'inline-block', textDecoration: 'none' }}>
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Almost There</span>
        <h1 className={styles.title}>Checkout</h1>
        <p className={styles.subtitle}>Complete your purchase in two easy steps.</p>
      </section>

      <div className="container" style={{ maxWidth: 860, padding: '40px 24px 90px', margin: '0 auto' }}>
        {cartItems.length === 0 ? (
          <div className={styles.empty} style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 4, padding: 60 }}>
            <p className={styles.emptyTitle}>Your cart is empty</p>
            <p className={styles.emptyText}>Add some fragrances before checking out.</p>
            <Link to="/men" className={styles.btn} style={{ display: 'inline-block', textDecoration: 'none' }}>Shop Collection</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Shipping Details</h2>
              <div className={styles.field}>
                <label className={styles.label}>Full Address *</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street, number, apartment"
                  className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                />
                {errors.address && <span className={styles.error}>{errors.address}</span>}
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>City *</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                  />
                  {errors.city && <span className={styles.error}>{errors.city}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Country *</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.country ? styles.inputError : ''}`}
                  />
                  {errors.country && <span className={styles.error}>{errors.country}</span>}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Payment Method</h2>
              <div className={styles.item} style={{ border: form.paymentMethod === 'cod' ? '1px solid var(--color-accent)' : '1px solid var(--color-border)' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === 'cod'}
                  onChange={handleChange}
                  id="cod"
                  style={{ accentColor: 'var(--color-accent)' }}
                />
                <label htmlFor="cod" style={{ fontSize: 14, cursor: 'pointer' }}>Cash on Delivery</label>
              </div>
              <div className={styles.item} style={{ border: form.paymentMethod === 'card' ? '1px solid var(--color-accent)' : '1px solid var(--color-border)' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={form.paymentMethod === 'card'}
                  onChange={handleChange}
                  id="card"
                  style={{ accentColor: 'var(--color-accent)' }}
                />
                <label htmlFor="card" style={{ fontSize: 14, cursor: 'pointer' }}>Credit / Debit Card</label>
              </div>

              {form.paymentMethod === 'card' && (
                <>
                  <div className={styles.field}>
                    <label className={styles.label}>Cardholder Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    />
                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Card Number *</label>
                    <input
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleChange}
                      placeholder="4242 4242 4242 4242"
                      className={`${styles.input} ${errors.cardNumber ? styles.inputError : ''}`}
                    />
                    {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
                  </div>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label}>Expiry (MM/YY) *</label>
                      <input
                        name="cardExpiry"
                        value={form.cardExpiry}
                        onChange={handleChange}
                        placeholder="12/28"
                        className={`${styles.input} ${errors.cardExpiry ? styles.inputError : ''}`}
                      />
                      {errors.cardExpiry && <span className={styles.error}>{errors.cardExpiry}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>CVC *</label>
                      <input
                        name="cardCvc"
                        value={form.cardCvc}
                        onChange={handleChange}
                        placeholder="123"
                        className={`${styles.input} ${errors.cardCvc ? styles.inputError : ''}`}
                      />
                      {errors.cardCvc && <span className={styles.error}>{errors.cardCvc}</span>}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Order Summary</h2>
              <div className={styles.items}>
                {cartItems.map((item) => (
                  <div className={styles.item} key={`${item.id}-${item.size}`}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemMeta}>{item.size} · Qty {item.quantity}</p>
                    </div>
                    <div style={{ fontWeight: 600 }}>{formatMoney(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div style={{ maxWidth: 320, marginLeft: 'auto', marginTop: 24 }}>
                <table className={styles.summaryTable}>
                  <tbody>
                    <tr>
                      <td style={{ color: 'var(--color-text-light)' }}>Subtotal</td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(cartTotal)}</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--color-text-light)' }}>Shipping</td>
                      <td style={{ textAlign: 'right' }}>{cartTotal >= 150 ? 'Free' : formatMoney(12)}</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(cartTotal >= 150 ? cartTotal : cartTotal + 12)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button type="submit" className={styles.btn} style={{ marginTop: 24, width: '100%' }} disabled={submitting}>
                {submitting ? 'Placing order...' : `Place Order · ${formatMoney(cartTotal >= 150 ? cartTotal : cartTotal + 12)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Checkout;