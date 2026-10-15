import { useEffect, useState } from 'react';
import { adminAPI } from '../../api/adminAPI';
import styles from './admin.module.css';

const FIELDS = [
  ['store_name', 'Store Name'],
  ['store_tagline', 'Store Tagline'],
  ['support_email', 'Support Email'],
  ['support_phone', 'Support Phone'],
  ['currency', 'Currency'],
  ['admin_notify_email', 'Admin Notification Email']
];

function Settings() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Settings | Essence Aura Admin';
    adminAPI.getSettings()
      .then((res) => setForm(res || {}))
      .catch((e) => setError(e.message || 'Failed to load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');
    try {
      await adminAPI.updateSettings(form);
      setMsg('Settings saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.empty}>Loading settings...</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSub}>Store-wide configuration used across the site.</p>
        </div>
      </div>

      {error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}
      {msg && <div className={`${styles.message} ${styles.success}`}>{msg}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.card}>
          {FIELDS.map(([key, label]) => (
            <div className={styles.formGroup} key={key}>
              <label className={styles.formLabel}>{label}</label>
              <input
                className={styles.input}
                style={{ width: '100%' }}
                name={key}
                value={form[key] ?? ''}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit" className={styles.btn} style={{ background: 'var(--color-accent)' }} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;