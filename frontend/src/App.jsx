import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { AdminProvider } from './context/AdminContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toaster from './components/Toaster';
import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';
import Unisex from './pages/Unisex';
import GiftSets from './pages/GiftSets';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AccountLayout from './pages/account/AccountLayout';
import Profile from './pages/account/Profile';
import Orders from './pages/account/Orders';
import OrderDetail from './pages/account/OrderDetail';
import Wishlist from './pages/account/Wishlist';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminReviews from './pages/admin/Reviews';
import AdminMessages from './pages/admin/Messages';
import AdminSubscribers from './pages/admin/Subscribers';
import AdminSettings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 14, color: '#999' }}>Loading...</span>
    </div>
  );
}

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <Outlet />;
}

function AdminRoute() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <PageLoader />;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <AdminProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="app">
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/men" element={<Men />} />
                    <Route path="/women" element={<Women />} />
                    <Route path="/unisex" element={<Unisex />} />
                    <Route path="/gift-sets" element={<GiftSets />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/product/:id" element={<ProductDetail />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />

                    <Route element={<ProtectedRoute />}>
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/account" element={<AccountLayout />}>
                        <Route index element={<Profile />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="orders/:id" element={<OrderDetail />} />
                        <Route path="wishlist" element={<Wishlist />} />
                      </Route>
                    </Route>

                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminRoute />}>
                      <Route element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/new" element={<ProductForm />} />
                        <Route path="products/:id/edit" element={<ProductForm />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="reviews" element={<AdminReviews />} />
                        <Route path="messages" element={<AdminMessages />} />
                        <Route path="subscribers" element={<AdminSubscribers />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="profile" element={<AdminProfile />} />
                      </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster />
              </div>
            </BrowserRouter>
          </CartProvider>
        </AdminProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;