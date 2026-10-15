import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../api/userAPI';
import styles from './account.module.css';

const emptyProfile = {
  first_name: '',
  last_name: '',
  phone: '',
  address: '',
  city: '',
  country: ''
};

function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(emptyProfile);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passErrors, setPassErrors] = useState({});
  const [passMessage, setPassMessage] = useState(null);
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    document.title = 'My Profile | Essence Aura';
  }, []);

  useEffect(() => {
    const p = user?.profile || {};
    setForm({
      first_name: p.first_name || '',
      last_name: p.last_name || '',
      phone: p.phone || '',
      address: p.address || '',
      city: p.city || '',
      country: p.country || ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (values) => {
    const errs = {};
    if (!values.first_name.trim()) errs.first_name = 'First name is required';
    if (!values.last_name.trim()) errs.last_name = 'Last name is required';
    if (values.phone && !/^[+()\-\s0-9]{7,15}$/.test(values.phone)) errs.phone = 'Enter a valid phone';
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    setMessage(null);
    try {
      const updated = await userAPI.updateProfile(form);
      updateUser(updated);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPassForm((prev) => ({ ...prev, [name]: value }));
    if (passErrors[name]) setPassErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (passForm.newPassword.length < 8) errs.newPassword = 'New password must be at least 8 characters';
    if (passForm.confirmPassword !== passForm.newPassword) errs.confirmPassword = 'Passwords do not match';
    setPassErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingPass(true);
    setPassMessage(null);
    try {
      await userAPI.changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPassMessage({ type: 'success', text: 'Password changed successfully.' });
    } catch (err) {
      setPassMessage({ type: 'error', text: err.message || 'Could not change password.' });
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Personal Information</h2>

        {message && (
          <p className={`${styles.message} ${message.type === 'success' ? styles.success : styles.fail}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSave} noValidate>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>First Name *</label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className={`${styles.input} ${errors.first_name ? styles.inputError : ''}`}
              />
              {errors.first_name && <span className={styles.error}>{errors.first_name}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Last Name *</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className={`${styles.input} ${errors.last_name ? styles.inputError : ''}`}
              />
              {errors.last_name && <span className={styles.error}>{errors.last_name}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input value={user?.email || ''} disabled className={styles.input} />
            <span className={styles.error} style={{ color: 'var(--color-text-light)' }}>
              Email changes are managed at registration for security.
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
            />
            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Address</label>
              <input name="address" value={form.address} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>City</label>
              <input name="city" value={form.city} onChange={handleChange} className={styles.input} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Country</label>
            <input name="country" value={form.country} onChange={handleChange} className={styles.input} />
          </div>

          <button type="submit" className={styles.btn} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Change Password</h2>

        {passMessage && (
          <p className={`${styles.message} ${passMessage.type === 'success' ? styles.success : styles.fail}`}>
            {passMessage.text}
          </p>
        )}

        <form onSubmit={handlePassword} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Current Password *</label>
            <input
              type="password"
              name="currentPassword"
              value={passForm.currentPassword}
              onChange={handlePassChange}
              className={`${styles.input} ${passErrors.currentPassword ? styles.inputError : ''}`}
            />
            {passErrors.currentPassword && <span className={styles.error}>{passErrors.currentPassword}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>New Password *</label>
              <input
                type="password"
                name="newPassword"
                value={passForm.newPassword}
                onChange={handlePassChange}
                className={`${styles.input} ${passErrors.newPassword ? styles.inputError : ''}`}
              />
              {passErrors.newPassword && <span className={styles.error}>{passErrors.newPassword}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={passForm.confirmPassword}
                onChange={handlePassChange}
                className={`${styles.input} ${passErrors.confirmPassword ? styles.inputError : ''}`}
              />
              {passErrors.confirmPassword && <span className={styles.error}>{passErrors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className={`${styles.btn} ${styles.btnAccent}`} disabled={savingPass}>
            {savingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;