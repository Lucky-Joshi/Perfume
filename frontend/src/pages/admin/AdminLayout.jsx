import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import styles from './admin.module.css';

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', icon: <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 12h8v9h-8zM3 15h8v6H3z"/> },
  { to: '/admin/products', label: 'Products', icon: <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/> },
  { to: '/admin/categories', label: 'Categories', icon: <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/> },
  { to: '/admin/orders', label: 'Orders', icon: <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/> },
  { to: '/admin/users', label: 'Users', icon: <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/> },
  { to: '/admin/reviews', label: 'Reviews', icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/> },
  { to: '/admin/messages', label: 'Messages', icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></> },
  { to: '/admin/subscribers', label: 'Subscribers', icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></> }
];

function AdminLayout() {
  const { admin } = useAdmin();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>EA</div>
          <div>
            <div className={styles.brandName}>Essence Aura</div>
            <div className={styles.brandTag}>Admin</div>
          </div>
        </div>

        <nav className={styles.navLinks}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {item.icon}
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sideFooter}>
          <NavLink to="/admin/profile" className={styles.sideFooterLink}>
            <span style={{ marginRight: 4 }}>
              {admin?.profile?.first_name
                ? `${admin.profile.first_name} ${admin.profile.last_name}`
                : admin?.email}
            </span>
          </NavLink>
          <Link to="/" className={styles.sideFooterLink}>View Storefront</Link>
          <button className={`${styles.sideFooterLink} ${styles.logout}`} onClick={handleLogout} style={{ textAlign: 'left', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;