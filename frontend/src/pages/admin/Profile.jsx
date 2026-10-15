import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { adminAPI } from '../../api/adminAPI';
import { initials } from '../../utils/format';
import styles from './admin.module.css';

function AdminProfile() {
  const { admin, setAdmin } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = 'Profile | Essence Aura Admin';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMsg('');
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (!form.currentPassword || !form.newPassword) {
      setError('Both current and new password are required.');
      return;
    }
    setSaving(true);
    setMsg('');
    setError('');
    try {
      await adminAPI.updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMsg('Password updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>My Profile</h1>
          <p className={styles.pageSub}>View your admin account and update your password.</p>
        </div>
      </div>

      <div className={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div className={styles.avatar} style={{ width: 56, height: 56, fontSize: 20 }}>{initials(admin?.email)}</div>
          <div>
            <div className={styles.cellTitle} style={{ fontSize: 18 }}>
              {admin?.profile?.first_name
                ? `${admin.profile.first_name} ${admin.profile.last_name}`
                : 'Administrator'}
            </div>
            <div className={styles.cellSub}>{admin?.email}</div>
            <span className={`${styles.badge} ${styles.badgeGold}`} style={{ marginTop: 6 }}>{admin?.role || 'admin'}</span>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle} style={{ marginBottom: 18 }}>Change Password</h2>

        {error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}
        {msg && <div className={`${styles.message} ${styles.success}`}>{msg}</div>}

        <form onSubmit={handlePassword} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Current Password</label>
            <input
              type="password"
              className={styles.input}
              style={{ width: '100%' }}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>New Password</label>
              <input
                type="password"
                className={styles.input}
                style={{ width: '100%' }}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Confirm New Password</label>
              <input
                type="password"
                className={styles.input}
                style={{ width: '100%' }}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>
          <button type="submit" className={styles.btn} style={{ background: 'var(--color-accent)' }} disabled={saving}>
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => navigate('/admin')}>Back to Dashboard</button>
    </div>
  );
}

export default AdminProfile;