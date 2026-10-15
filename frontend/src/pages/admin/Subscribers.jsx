import React, { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { formatDate } from '../../utils/format';
import styles from './admin.module.css';

function Subscribers() {
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.listNewsletter({ page, limit });
      setList(res.list || []);
      setMeta(res.meta);
    } catch (e) {
      setError(e.message || 'Failed to load subscribers.');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    document.title = 'Subscribers | Essence Aura Admin';
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!confirm) return;
    setBusyId(confirm.id);
    try {
      await adminAPI.deleteSubscriber(confirm.id);
      setConfirm(null);
      load();
    } catch (e) {
      setError(e.message || 'Failed to delete subscriber.');
      setConfirm(null);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>Newsletter Subscribers</h1>
          <p className={styles.pageSub}>{meta ? `${meta.total} subscribers` : 'Email list subscribers'}</p>
        </div>
      </div>

      <div className={styles.card}>
        {error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id}>
                  <td className={styles.cellTitle}>{s.email}</td>
                  <td>
                    <span className={`${styles.badge} ${s.active ? styles.badgeGreen : styles.badgeGray}`}>
                      {s.active ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                  <td className={styles.cellSub}>{formatDate(s.created_at)}</td>
                  <td>
                    <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} title="Delete" onClick={() => setConfirm({ id: s.id, email: s.email })}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && list.length === 0 && (
                <tr><td colSpan={4} className={styles.empty}>No subscribers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && <div className={styles.empty}>Loading subscribers...</div>}

        {meta && meta.pages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span className={styles.pageInfo}>Page {meta.page} of {meta.pages}</span>
            <button className={styles.pageBtn} disabled={page >= meta.pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>

      {confirm && (
        <div className={styles.modal}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>Delete Subscriber</h3>
            <p className={styles.modalText}>Remove <strong>{confirm.email}</strong> from the list?</p>
            <div className={styles.modalActions}>
              <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setConfirm(null)}>Cancel</button>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscribers;