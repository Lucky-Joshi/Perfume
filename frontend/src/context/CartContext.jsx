import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../api/cartAPI';

const CartContext = createContext();

const fromServerItem = (item) => ({
  id: item.id,
  name: item.product?.name || 'Perfume',
  price: Number(item.product?.price ?? 0),
  image: Array.isArray(item.product?.images) ? item.product.images[0] : '',
  size: item.size,
  quantity: item.quantity,
  synced: true
});

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [toasts, setToasts] = useState([]);
  const cartRef = useRef(cartItems);
  cartRef.current = cartItems;

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const syncFromServer = useCallback(async () => {
    try {
      const items = await cartAPI.get();
      setCartItems(items.map(fromServerItem));
    } catch {
      /* keep local snapshot */
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      syncFromServer();
    } else {
      setCartItems([]);
    }
  }, [user?.id, syncFromServer]);

  const addToCart = useCallback(
    (product, selectedSize = null) => {
      const size = selectedSize || product.sizes?.[0] || 'Standard';
      const name = product.name || 'Perfume';

      setCartItems((prev) => {
        const existing = prev.find(
          (i) => i.name === name && i.size === size
        );
        if (existing) {
          return prev.map((i) =>
            i.name === name && i.size === size ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [
          ...prev,
          {
            id: `local-${Date.now()}`,
            name,
            price: Number(product.price ?? 0),
            image: product.image || '',
            size,
            quantity: 1,
            synced: false
          }
        ];
      });

      if (user?.id) {
        cartAPI
          .add({ productId: product.id, quantity: 1, size })
          .then(syncFromServer)
          .catch(() => addToast('Could not sync cart with server.', 'error'));
      }

      addToast(`${name} added to cart`);
    },
    [user?.id, syncFromServer, addToast]
  );

  const removeFromCart = useCallback(
    (cartItemId, size) => {
      const item = cartRef.current.find((i) => i.id === cartItemId && i.size === size);
      setCartItems((prev) => prev.filter((i) => !(i.id === cartItemId && i.size === size)));

      if (item?.synced && user?.id) {
        cartAPI.remove(cartItemId).catch(() => addToast('Could not update cart.', 'error'));
      }
    },
    [user?.id, addToast]
  );

  const updateQuantity = useCallback(
    (cartItemId, size, quantity) => {
      if (quantity <= 0) {
        removeFromCart(cartItemId, size);
        return;
      }
      const item = cartRef.current.find((i) => i.id === cartItemId && i.size === size);
      setCartItems((prev) =>
        prev.map((i) => (i.id === cartItemId && i.size === size ? { ...i, quantity } : i))
      );

      if (item?.synced && user?.id) {
        cartAPI.update(cartItemId, quantity).catch(() => addToast('Could not update cart.', 'error'));
      }
    },
    [user?.id, removeFromCart, addToast]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    if (user?.id) {
      cartAPI.clear().catch(() => addToast('Could not clear server cart.', 'error'));
    }
  }, [user?.id, addToast]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toasts,
        addToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}