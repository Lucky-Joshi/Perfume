import React, { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { formatMoney, formatDateTime } from '../../utils/format';
import styles from './admin.module.css';

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function Orders() {
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const limit = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.listOrders({ page, limit, status, search });
      setList(res.list || []);
      setMeta(res.meta);
    } catch (e) {
      setError(e.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, search]);

  useEffect(() => {
    document.title = 'Orders | Essence Aura Admin';
    load();
  }, [load]);

  const changeStatus = async (id, newStatus) => {
    setBusyId(id);
    setError('');
    try {
      await adminAPI.updateOrderStatus(id, newStatus);
      load();
    } catch (e) {
      setError(e.message || 'Failed to update order status.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>Orders</h1>
          <p className={styles.pageSub}>{meta ? `${meta.total} orders` : 'Customer orders'}</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.toolbar}>
          <input
            className={styles.input}
            style={{ flex: 1, minWidth: 180 }}
            placeholder="Search by order id (EA-...)"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select className={styles.select} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => {
                const items = o.items || [];
                const subtotal = items.reduce((s, i) => s + (Number(i.price) * Number(i.quantity || 1)), 0);
                return (
                  <React.Fragment key={o.id}>
                    <tr>
                      <td className={styles.cellTitle}>{o.id}</td>
                      <td>{o.user?.email || '—'}</td>
                      <td className={styles.cellSub}>{items.length} item(s)</td>
                      <td>{formatMoney(Number(o.total))}</td>
                      <td className={styles.cellSub}>{o.payment_method}</td>
                      <td>
                        <select
                          className={styles.select}
                          value={o.status}
                          disabled={busyId === o.id}
                          onChange={(e) => changeStatus(o.id, e.target.value)}
                        >
                          {STATUSES.filter((s) => s !== 'all').map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td className={styles.cellSub}>{formatDateTime(o.created_at)}</td>
                      <td>
                        <button className={styles.btnLink} onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                          {expanded === o.id ? 'Hide' : 'Details'}
                        </button>
                      </td>
                    </tr>
                    {expanded === o.id && (
                      <tr>
                        <td colSpan={8}>
                          <div style={{ padding: '10px 8px 18px' }}>
                            <h4 className={styles.cellTitle} style={{ marginBottom: 10 }}>Order Items</h4>
                            {items.map((i) => (
                              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--color-border)', fontSize: 14 }}>
                                <div>
                                  {i.product?.name || i.product_name || 'Product'} <span className={styles.cellSub}>× {i.quantity} ({i.size})</span>
                                </div>
                                <span>{formatMoney(Number(i.price) * Number(i.quantity || 1))}</span>
                              </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 14 }}>
                              <span className={styles.cellSub}>Shipping: {o.shipping_address?.city}, {o.shipping_address?.country}</span>
                              <span className={styles.cellTitle}>Total {formatMoney(Number(o.total))}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {!loading && list.length === 0 && (
                <tr><td colSpan={8} className={styles.empty}>No orders match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && <div className={styles.empty}>Loading orders...</div>}

        {meta && meta.pages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span className={styles.pageInfo}>Page {meta.page} of {meta.pages}</span>
            <button className={styles.pageBtn} disabled={page >= meta.pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;