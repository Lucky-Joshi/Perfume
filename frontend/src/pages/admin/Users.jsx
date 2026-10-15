import { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { formatDate, initials } from '../../utils/format';
import styles from './admin.module.css';

const STATUSES = ['active', 'suspended'];
const ROLES = ['customer', 'admin'];

function Users() {
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.listUsers({ page, limit, search, status });
      setList(res.list || []);
      setMeta(res.meta);
    } catch (e) {
      setError(e.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  useEffect(() => {
    document.title = 'Users | Essence Aura Admin';
    load();
  }, [load]);

  const toggleStatus = async (user) => {
    const next = user.status === 'active' ? 'suspended' : 'active';
    setBusyId(user.id);
    try {
      await adminAPI.updateUserStatus(user.id, next);
      load();
    } catch (e) {
      setError(e.message || 'Failed to update user status.');
    } finally {
      setBusyId(null);
    }
  };

  const changeRole = async (id, role) => {
    setBusyId(id);
    try {
      await adminAPI.updateUserRole(id, role);
      load();
    } catch (e) {
      setError(e.message || 'Failed to update user role.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    setBusyId(confirm.id);
    try {
      await adminAPI.deleteUser(confirm.id);
      setConfirm(null);
      load();
    } catch (e) {
      setError(e.message || 'Failed to delete user.');
      setConfirm(null);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>Users</h1>
          <p className={styles.pageSub}>{meta ? `${meta.total} registered users` : 'Registered customers'}</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.toolbar}>
          <input
            className={styles.input}
            style={{ flex: 1, minWidth: 180 }}
            placeholder="Search by email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select className={styles.select} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => {
                const name = `${u.profile?.first_name || ''} ${u.profile?.last_name || ''}`.trim();
                return (
                  <tr key={u.id}>
                    <td>
                      <div className={styles.productThumb}>
                        {u.profile?.avatar_url ? (
                          <img src={u.profile.avatar_url} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div className={styles.avatar}>{initials(u.email)}</div>
                        )}
                        <div>
                          <div className={styles.cellTitle}>{name || u.email}</div>
                          <div className={styles.cellSub}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select
                        className={styles.select}
                        value={u.role}
                        disabled={busyId === u.id}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${u.status === 'active' ? styles.badgeGreen : styles.badgeRed}`}>{u.status}</span>
                    </td>
                    <td className={styles.cellSub}>{formatDate(u.created_at)}</td>
                    <td className={styles.cellSub}>{u.email_verified ? 'Yes' : 'No'}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={`${styles.btn} ${styles.btnOutline}`} style={{ padding: '7px 12px' }} disabled={busyId === u.id} onClick={() => toggleStatus(u)}>
                          {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                        <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} title="Delete user" onClick={() => setConfirm({ id: u.id, email: u.email })}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && list.length === 0 && (
                <tr><td colSpan={6} className={styles.empty}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && <div className={styles.empty}>Loading users...</div>}

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
            <h3 className={styles.modalTitle}>Delete User</h3>
            <p className={styles.modalText}>Permanently delete <strong>{confirm.email}</strong>?</p>
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

export default Users;