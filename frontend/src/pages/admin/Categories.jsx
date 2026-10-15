import { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '../../api/adminAPI';
import { formatDate } from '../../utils/format';
import styles from './admin.module.css';

function Categories() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.listCategories();
      setList(res || []);
    } catch (e) {
      setError(e.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Categories | Essence Aura Admin';
    load();
  }, [load]);

  const openNew = () => {
    setEditing({ id: null });
    setForm({ name: '', slug: '', description: '' });
  };

  const openEdit = (cat) => {
    setEditing({ id: cat.id });
    setForm({ name: cat.name || '', slug: cat.slug || '', description: cat.description || '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Category name is required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (editing.id) {
        await adminAPI.updateCategory(editing.id, form);
      } else {
        await adminAPI.createCategory(form);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      await adminAPI.deleteCategory(confirm.id);
      setConfirm(null);
      load();
    } catch (e) {
      setError(e.message || 'Failed to delete category.');
      setConfirm(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageSub}>Organise products by category and name.</p>
        </div>
        <button className={styles.btn} style={{ background: 'var(--color-accent)' }} onClick={openNew}>+ New Category</button>
      </div>

      {error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <div className={styles.card}>
          {loading ? (
            <div className={styles.empty}>Loading categories...</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((c) => (
                    <tr key={c.id}>
                      <td className={styles.cellTitle}>{c.name}</td>
                      <td className={styles.cellSub}>{c.slug}</td>
                      <td className={styles.cellSub}>{(c.description || '').slice(0, 40)}</td>
                      <td className={styles.cellSub}>{formatDate(c.created_at)}</td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.iconBtn} title="Edit" onClick={() => openEdit(c)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} title="Delete" onClick={() => setConfirm({ id: c.id, name: c.name })}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {list.length === 0 && (
                    <tr><td colSpan={5} className={styles.empty}>No categories yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editing && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 16 }}>
              {editing.id ? 'Edit Category' : 'New Category'}
            </h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Name *</label>
                <input className={styles.input} style={{ width: '100%' }} name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slug</label>
                <input className={styles.input} style={{ width: '100%' }} name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea className={styles.textarea} rows={3} name="description" value={form.description} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className={styles.btn} style={{ background: 'var(--color-accent)' }} disabled={busy}>
                  {busy ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {confirm && (
        <div className={styles.modal}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>Delete Category</h3>
            <p className={styles.modalText}>
              Delete <strong>{confirm.name}</strong>? Products assigned to it will keep their gender but lose the category link.
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

export default Categories;