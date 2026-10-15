import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import productsAPI, { normalizeProduct } from '../api/productsAPI';
import { categoriesAPI } from '../api/categoriesAPI';

const ProductContext = createContext();

const FALLBACK_CATEGORIES = [
  { id: 'eau-de-parfum', name: 'Eau de Parfum', slug: 'eau-de-parfum' },
  { id: 'eau-de-toilette', name: 'Eau de Toilette', slug: 'eau-de-toilette' },
  { id: 'oud-and-intense', name: 'Oud & Intense', slug: 'oud-and-intense' },
  { id: 'floral', name: 'Floral', slug: 'floral' },
  { id: 'woody-and-earthy', name: 'Woody & Earthy', slug: 'woody-and-earthy' }
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await productsAPI.list({ limit: 60 });
      setProducts(list);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshFeatured = useCallback(async () => {
    setFeaturedLoading(true);
    try {
      const feat = await productsAPI.featured();
      setFeatured(feat);
    } catch {
      setFeatured([]);
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    refreshFeatured();
    categoriesAPI
      .list()
      .then(setCategories)
      .catch(() => setCategories(FALLBACK_CATEGORIES));
  }, [reload, refreshFeatured]);

  const byGender = useCallback(
    (gender) => products.filter((p) => (p.category || 'unisex') === gender),
    [products]
  );

  const getById = useCallback(
    (identifier) => {
      const id = String(identifier);
      return products.find((p) => String(p.id) === id) || null;
    },
    [products]
  );

  const addProduct = useCallback((product) => {
    setProducts((prev) => [normalizeProduct(product), ...prev.filter((p) => String(p.id) !== String(product.id))]);
    setFeatured((prev) => {
      if (!product.featured) return prev;
      return [
        normalizeProduct(product),
        ...prev.filter((p) => String(p.id) !== String(product.id))
      ];
    });
  }, []);

  const removeProduct = useCallback((id) => {
    const sid = String(id);
    setProducts((prev) => prev.filter((p) => String(p.id) !== sid));
    setFeatured((prev) => prev.filter((p) => String(p.id) !== sid));
  }, []);

  const updateProduct = addProduct;

  return (
    <ProductContext.Provider
      value={{
        products,
        featured,
        categories,
        loading,
        featuredLoading,
        reload,
        refreshFeatured,
        byGender,
        getById,
        addProduct,
        updateProduct,
        removeProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}