import { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { formatDate } from '../../utils/format';
import styles from './admin.module.css';

const STATUSES = ['pending', 'approved', 'rejected'];

function Reviews() {
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatusFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const limit = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.listReviews({ page, limit, status });
      setList(res.list || []);
      setMeta(res.meta);
    } catch (e) {
      setError(e.message || 'Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, status]);

  useEffect(() => {
    document.title = 'Reviews | Essence Aura Admin';
    load();
  }, [load]);

  const setStatus = async (id, next) => {
    setBusyId(id);
    try {
      await adminAPI.moderateReview(id, next);
      load();
    } catch (e) {
      setError(e.message || 'Failed to update review.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    setBusyId(confirm.id);
    try {
      await adminAPI.deleteReview(confirm.id);
      setConfirm(null);
      load();
    } catch (e) {
      setError(e.message || 'Failed to delete review.');
      setConfirm(null);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>Reviews</h1>
          <p className={styles.pageSub}>{meta ? `${meta.total} reviews` : 'Customer product reviews'}</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.toolbar}>
          <select className={styles.select} value={status} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>User</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td className={styles.cellTitle}>{r.product?.name || 'N/A'}</td>
                  <td>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </td>
                  <td className={styles.cellSub}>{(r.comment || '').slice(0, 90)}</td>
                  <td className={styles.cellSub}>{r.user?.email || 'N/A'}</td>
                  <td><span className={`${styles.badge} ${r.status === 'approved' ? styles.badgeGreen : r.status === 'rejected' ? styles.badgeRed : styles.badgeGold}`}>{r.status}</span></td>
                  <td className={styles.cellSub}>{formatDate(r.created_at)}</td>
                  <td>
                    <div className={styles.actions}>
                      {r.status !== 'approved' && (
                        <button className={styles.btnLink} disabled={busyId === r.id} onClick={() => setStatus(r.id, 'approved')}>Approve</button>
                      )}
                      {r.status !== 'rejected' && (
                        <button className={`${styles.btnLink} ${styles.btnLinkDanger}`} disabled={busyId === r.id} onClick={() => setStatus(r.id, 'rejected')}>Reject</button>
                      )}
                      <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} title="Delete" onClick={() => setConfirm({ id: r.id })}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && list.length === 0 && (
                <tr><td colSpan={7} className={styles.empty}>No reviews found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && <div className={styles.empty}>Loading reviews...</div>}

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
            <h3 className={styles.modalTitle}>Delete Review</h3>
            <p className={styles.modalText}>Permanently remove this review?</p>
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

export default Reviews;