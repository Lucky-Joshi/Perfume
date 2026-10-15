import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../../api/ordersAPI';
import { formatDate, formatMoney, statusClass } from '../../utils/format';
import styles from './account.module.css';

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { list } = await ordersAPI.myOrders({ limit: 50 });
      setOrders(list || []);
    } catch (err) {
      setError(err.message || 'Could not load your orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'My Orders | Essence Aura';
    load();
  }, [load]);

  if (loading) return <div className={styles.empty}>Loading your orders...</div>;
  if (error) return <div className={styles.empty}><p className={styles.fail}>{error}</p></div>;

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>My Orders</h2>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No orders yet</p>
          <p className={styles.emptyText}>When you place an order it will appear here.</p>
          <Link to="/men" className={styles.btn} style={{ display: 'inline-block', textDecoration: 'none' }}>
            Shop Collection
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Placed</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><Link to={`/account/orders/${order.id}`} className={styles.link}>{order.id}</Link></td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{(order.items || []).length}</td>
                  <td>{formatMoney(order.total_amount)}</td>
                  <td>
                    <span className={`${styles.status} ${statusClass(order.status)}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/account/orders/${order.id}`} className={styles.link}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Orders;