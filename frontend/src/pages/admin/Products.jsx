import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api/adminAPI';
import { formatMoney } from '../../utils/format';
import styles from './admin.module.css';

const GENDERS = ['all', 'men', 'women', 'unisex'];

function Products() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('all');
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.listProducts({ page, limit, search, gender });
      setList(res.list || []);
      setMeta(res.meta);
    } catch (e) {
      setError(e.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, gender]);

  useEffect(() => {
    document.title = 'Products | Essence Aura Admin';
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      await adminAPI.deleteProduct(confirm.id);
      setConfirm(null);
      load();
    } catch (e) {
      setError(e.message || 'Failed to delete product.');
      setConfirm(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.pageSub}>{meta ? `${meta.total} products in catalog` : 'Manage your catalog'}</p>
        </div>
        <Link to="/admin/products/new" className={styles.btn} style={{ background: 'var(--color-accent)' }}>
          + Add Product
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.toolbar}>
          <input
            className={styles.input}
            style={{ flex: 1, minWidth: 200 }}
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select className={styles.select} value={gender} onChange={(e) => { setGender(e.target.value); setPage(1); }}>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g === 'all' ? 'All genders' : g.charAt(0).toUpperCase() + g.slice(1)}</option>
            ))}
          </select>
        </div>

        {error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Gender</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Badge</th>
                <th>Flags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.productThumb}>
                      <img className={styles.cellImage} src={p.images?.[0] || p.image} alt={p.name} />
                      <div>
                        <div className={styles.cellTitle}>{p.name}</div>
                        <div className={styles.cellSub}>{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.cellSub}>{p.gender}</td>
                  <td>{formatMoney(Number(p.price))}</td>
                  <td><span className={Number(p.stock) <= 5 ? styles.badgeRed : ''} style={{ fontSize: 14 }}>{p.stock}</span></td>
                  <td>{p.badge ? <span className={`${styles.badge} ${styles.badgeGold}`}>{p.badge}</span> : '—'}</td>
                  <td className={styles.cellSub}>
                    <span>{p.featured ? 'Featured' : ''}</span>{' '}
                    <span>{p.trending ? 'Trending' : ''}</span>{' '}
                    <span>{p.best_seller ? 'Best Seller' : ''}</span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.iconBtn}
                        title="Edit"
                        onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                        title="Delete"
                        onClick={() => setConfirm({ id: p.id, name: p.name })}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && list.length === 0 && (
                <tr><td colSpan={7} className={styles.empty}>No products match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && <div className={styles.empty}>Loading products...</div>}

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
            <h3 className={styles.modalTitle}>Delete Product</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete <strong>{confirm.name}</strong>? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setConfirm(null)} disabled={busy}>Cancel</button>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDelete} disabled={busy}>
                {busy ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;