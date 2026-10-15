import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import CartDrawer from './CartDrawer';
import styles from './Navbar.module.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowSearch(false);
    setCartOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/men', label: 'Men' },
    { to: '/women', label: 'Women' },
    { to: '/unisex', label: 'Unisex' },
    { to: '/gift-sets', label: 'Gift Sets' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>EA</span>
            <span className={styles.logoText}>
              <span className={styles.logoName}>Essence Aura</span>
              <span className={styles.logoTagline}>Luxury in Every Drop</span>
            </span>
          </Link>

          <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`${styles.navLink} ${location.pathname === link.to ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            <button
              className={styles.iconBtn}
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            <div className={styles.userWrap} ref={userMenuRef}>
              <button
                className={styles.iconBtn}
                onClick={() => {
                  if (user) setUserMenuOpen(open => !open);
                  else navigate('/login');
                }}
                aria-label="Account"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>

              {user && userMenuOpen && (
                <div className={styles.userMenu}>
                  <div className={styles.userMenuHeader}>
                    <span className={styles.userMenuName}>
                      {user.profile?.first_name || user.email}
                    </span>
                    <span className={styles.userMenuEmail}>{user.email}</span>
                  </div>
                  <Link to="/account" className={styles.userMenuLink}>My Profile</Link>
                  <Link to="/account/orders" className={styles.userMenuLink}>My Orders</Link>
                  <Link to="/account/wishlist" className={styles.userMenuLink}>Wishlist</Link>
                  {isAdmin && (
                    <Link to="/admin" className={styles.userMenuLink}>Admin Panel</Link>
                  )}
                  <button className={styles.userMenuLogout} onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>

            <button className={styles.iconBtn} onClick={() => setCartOpen(true)} aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </button>

            <button
              className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {showSearch && (
        <SearchBar onClose={() => setShowSearch(false)} />
      )}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
}

export default Navbar;
