import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './account.module.css';

function AccountLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initial =
    (user?.profile?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>My Account</span>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>{user?.email}</p>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sideHeader}>
            <div className={styles.sideName}>
              {user?.profile?.first_name} {user?.profile?.last_name || initial}
            </div>
            <div className={styles.sideEmail}>{user?.email}</div>
          </div>

          <NavLink
            to="/account"
            end
            className={({ isActive }) => `${styles.sideLink} ${isActive ? styles.active : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Profile
          </NavLink>

          <NavLink
            to="/account/orders"
            className={({ isActive }) => `${styles.sideLink} ${isActive ? styles.active : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            My Orders
          </NavLink>

          <NavLink
            to="/account/wishlist"
            className={({ isActive }) => `${styles.sideLink} ${isActive ? styles.active : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            Wishlist
          </NavLink>

          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </aside>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AccountLayout;