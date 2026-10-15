import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { adminAPI } from '../../api/adminAPI';
import { formatMoney, formatDate } from '../../utils/format';
import styles from './admin.module.css';

const STATUS_BADGE = {
  pending: styles.badgeGold,
  processing: styles.badgeBlue,
  shipped: styles.badgePurple,
  delivered: styles.badgeGreen,
  cancelled: styles.badgeRed,
  approved: styles.badgeGreen,
  rejected: styles.badgeRed,
  published: styles.badgeGreen,
  active: styles.badgeGreen,
  suspended: styles.badgeRed
};

const statusBadge = (s) => STATUS_BADGE[s] || styles.badgeGray;

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await adminAPI.dashboard();
      setData(res);
    } catch (e) {
      setError(e.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Dashboard | Essence Aura Admin';
    load();
  }, [load]);

  if (loading) return <div className={styles.empty}>Loading dashboard...</div>;
  if (error) return <div className={styles.message}>{error}</div>;

  const { stats } = data;
  const revenueSeries = (data.revenueSeries || []).map((d) => ({
    day: d.day,
    revenue: Number(d.revenue || 0)
  }));

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSub}>Overview of store performance and recent activity.</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Total Revenue</div>
          <div className={styles.statValue}>{formatMoney(stats.revenue)}</div>
          <div className={styles.statHint}>Last 30 days</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Orders</div>
          <div className={styles.statValue}>{stats.orders}</div>
          <div className={styles.statHint}><Link to="/admin/orders" className={styles.btnLink}>View orders</Link></div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Products</div>
          <div className={styles.statValue}>{stats.products}</div>
          <div className={styles.statHint}><Link to="/admin/products" className={styles.btnLink}>Manage catalog</Link></div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Customers</div>
          <div className={styles.statValue}>{stats.customers}</div>
          <div className={styles.statHint}><Link to="/admin/users" className={styles.btnLink}>All users</Link></div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Pending Reviews</div>
          <div className={styles.statValue}>{stats.pendingReviews}</div>
          <div className={`${styles.statHint} ${stats.pendingReviews > 0 ? styles.statHintWarn : ''}`}>
            awaiting moderation
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Unread Messages</div>
          <div className={styles.statValue}>{stats.unreadMessages}</div>
          <div className={`${styles.statHint} ${stats.unreadMessages > 0 ? styles.statHintWarn : ''}`}>
            from contact form
          </div>
        </div>
      </div>

      {revenueSeries.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardRow}>
            <h2 className={styles.cardTitle}>Revenue (Last 7 Days)</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#b5b0a6" />
              <YAxis tick={{ fontSize: 11 }} stroke="#b5b0a6" />
              <Tooltip formatter={(v) => formatMoney(Number(v))} />
              <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardRow}>
          <h2 className={styles.cardTitle}>Recent Orders</h2>
          <Link to="/admin/orders" className={styles.btnLink}>View all</Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(data.recentOrders || []).map((o) => (
                <tr key={o.id}>
                  <td className={styles.cellTitle}>{o.id}</td>
                  <td>{o.user?.email || '—'}</td>
                  <td>{formatMoney(Number(o.total_amount))}</td>
                  <td><span className={`${styles.badge} ${statusBadge(o.status)}`}>{o.status}</span></td>
                  <td className={styles.cellSub}>{formatDate(o.created_at)}</td>
                </tr>
              ))}
              {(data.recentOrders || []).length === 0 && (
                <tr><td colSpan={5} className={styles.empty}>No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardRow}>
          <h2 className={styles.cardTitle}>Latest Reviews</h2>
          <Link to="/admin/reviews" className={styles.btnLink}>Moderate</Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(data.latestReviews || []).map((r) => (
                <tr key={r.id}>
                  <td>{r.product?.name || '—'}</td>
                  <td>{r.rating}/5</td>
                  <td className={styles.cellSub}>{(r.comment || '').slice(0, 60)}</td>
                  <td><span className={`${styles.badge} ${statusBadge(r.status)}`}>{r.status}</span></td>
                </tr>
              ))}
              {(data.latestReviews || []).length === 0 && (
                <tr><td colSpan={4} className={styles.empty}>No reviews yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;