import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersAPI } from '../../api/ordersAPI';
import { formatMoney, statusClass } from '../../utils/format';
import styles from './account.module.css';

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ordersAPI.getById(id);
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Could not load order.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    document.title = `Order ${id} | Essence Aura`;
    load();
  }, [id, load]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order? Stock will be restored and the order cannot be undone.')) return;
    try {
      await ordersAPI.cancel(id);
      load();
    } catch (err) {
      alert(err.message || 'Could not cancel order.');
    }
  };

  if (loading) return <div className={styles.empty}>Loading order...</div>;
  if (error) return <div className={styles.empty}><p className={styles.fail}>{error}</p></div>;
  if (!order) return null;

  return (
    <div>
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Order {order.id}</h2>
          <span className={`${styles.status} ${statusClass(order.status)}`}>
            {STATUS_LABELS[order.status] || order.status}
          </span>
        </div>

        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 14, color: 'var(--color-text-light)' }}>
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
          {order.shipping_address && (
            <p style={{ fontSize: 14, marginTop: 8 }}>
              Ship to: {order.shipping_address}, {order.shipping_city}, {order.shipping_country}
            </p>
          )}
        </div>

        <div className={styles.items} style={{ marginTop: 20 }}>
          {(order.items || []).map((item) => (
            <div className={styles.item} key={`${item.product_id}-${item.variant}`}>
              {item.image && (
                <img src={item.image} alt={item.product_name} className={styles.itemImage} />
              )}
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.product_name}</p>
                <p className={styles.itemMeta}>
                  {item.variant || 'Standard'} · Qty {item.quantity} · {formatMoney(item.unit_price)} each
                </p>
              </div>
              <div style={{ fontWeight: 600 }}>{formatMoney(item.line_total)}</div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 320, marginLeft: 'auto', marginTop: 24 }}>
          <table className={styles.summaryTable}>
            <tbody>
              <tr>
                <td style={{ color: 'var(--color-text-light)' }}>Subtotal</td>
                <td style={{ textAlign: 'right' }}>{formatMoney(order.subtotal)}</td>
              </tr>
              {Number(order.shipping_cost) > 0 && (
                <tr>
                  <td style={{ color: 'var(--color-text-light)' }}>Shipping</td>
                  <td style={{ textAlign: 'right' }}>{formatMoney(order.shipping_cost)}</td>
                </tr>
              )}
              {Number(order.discount) > 0 && (
                <tr>
                  <td style={{ color: 'var(--color-text-light)' }}>Discount</td>
                  <td style={{ textAlign: 'right' }}>-{formatMoney(order.discount)}</td>
                </tr>
              )}
              <tr>
                <td>Total</td>
                <td style={{ textAlign: 'right' }}>{formatMoney(order.total_amount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {order.status === 'pending' && (
          <button className={`${styles.btn} ${styles.btnAccent}`} style={{ marginTop: 24 }} onClick={handleCancel}>
            Cancel Order
          </button>
        )}

        <div style={{ marginTop: 24 }}>
          <Link to="/account/orders" className={styles.link}>← Back to orders</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;