import api, { normalizeError } from './api';
import localProducts, {
  getFeaturedProducts,
  getProductById,
  searchProducts
} from '../data/products';

const FALLBACK_DELAY = 1000;

export const normalizeProduct = (p) => {
  const raw = p?.raw ?? p;
  const discount = Number(raw.discount_price ?? raw.discount ?? 0);
  const featured = raw.featured ?? true;
  const best = raw.best_seller ?? false;
  const trending = raw.trending ?? false;
  const badge =
    raw.badge ||
    (best ? 'Best Seller' : trending ? 'Trending' : featured ? 'Featured' : null);

  return {
    ...raw,
    id: String(raw.id),
    name: raw.name,
    image: Array.isArray(raw.images) && raw.images.length ? raw.images[0] : '',
    category: raw.gender || 'unisex',
    price: Number(discount > 0 && raw.price ? Number(raw.price) - discount : raw.price ?? 0),
    originalPrice: discount > 0 ? Number(raw.price ?? 0) : null,
    sizes: Array.isArray(raw.sizes) && raw.sizes.length ? raw.sizes : ['50ml', '100ml'],
    rating: Number(raw.rating ?? 4.5),
    reviewsCount: Number(raw.reviews_count ?? 0),
    fragranceNotes: {
      top: Array.isArray(raw.top_notes) ? raw.top_notes : [],
      heart: Array.isArray(raw.middle_notes) ? raw.middle_notes : [],
      base: Array.isArray(raw.base_notes) ? raw.base_notes : []
    },
    stock: Number(raw.stock ?? 0),
    availability: Number(raw.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock',
    badge,
    featured,
    bestSeller: best,
    trending
  };
};

const normalizeList = (list) => (Array.isArray(list) ? list.map(normalizeProduct) : []);

const toLocal = (p) => ({
  id: Number(p.id),
  name: p.name,
  category: p.category,
  price: p.price,
  description: p.description,
  image: p.image,
  sizes: p.sizes || ['50ml', '100ml'],
  fragranceNotes: p.fragranceNotes || { top: [], heart: [], base: [] },
  rating: p.rating || 4.5,
  availability: p.availability || 'In Stock',
  featured: p.featured,
  badge: p.badge
});

const withFallback = async (fn, fallback) => {
  try {
    const res = await fn();
    return res;
  } catch {
    await new Promise((r) => setTimeout(r, FALLBACK_DELAY));
    return fallback();
  }
};

export const withProductFallback = withFallback;

export const productsAPI = {
  async list(params = {}) {
    return withFallback(
      () =>
        api
          .get('/products', { params, signal: AbortSignal.timeout(3000) })
          .then((res) => res.data?.data?.products ?? res.data?.data ?? res.data),
      () => {
        let items = [...localProducts];
        const { gender, category, search, featured, sale, sort } = params;
        if (gender || category) items = items.filter((p) => p.category === (gender || category));
        if (featured) items = items.filter((p) => p.featured);
        if (sale) items = items.filter((p) => p.originalPrice);
        if (search) {
          const lower = search.toLowerCase();
          items = items.filter(
            (p) =>
              p.name.toLowerCase().includes(lower) ||
              (p.description || '').toLowerCase().includes(lower)
          );
        }
        if (sort === 'price_asc') items.sort((a, b) => a.price - b.price);
        if (sort === 'price_desc') items.sort((a, b) => b.price - a.price);
        return normalizeList(items.map(toLocal));
      }
    );
  },

  async getByIdentifier(id) {
    return withFallback(
      () => api.get(`/products/${id}`).then((res) => normalizeProduct(res.data?.data ?? res.data)),
      () => {
        const p = getProductById(id);
        if (!p) throw new Error(`Product "${id}" not found.`);
        return normalizeProduct(toLocal(p));
      }
    );
  },

  async featured() {
    try {
      const items = await this.list({ featured: true, limit: 24 });
      return items;
    } catch {
      return normalizeList(getFeaturedProducts().map(toLocal));
    }
  },

  async search(query) {
    const lower = (query || '').toLowerCase().trim();
    if (lower.length < 2) return [];
    try {
      const params = { search: query, limit: 12 };
      return withFallback(
        () =>
          api.get('/products', { params, signal: AbortSignal.timeout(2500) }).then((res) => {
            const list = res.data?.data?.products ?? res.data?.data ?? res.data;
            return normalizeList(list);
          }),
        () => normalizeList(searchProducts(query).map(toLocal))
      );
    } catch {
      return normalizeList(searchProducts(query).map(toLocal));
    }
  },

  async create(data) {
    return api.post('/products', data).then((res) => normalizeProduct(res.data?.data ?? res.data));
  },

  async update(id, data) {
    return api.put(`/products/${id}`, data).then((res) => normalizeProduct(res.data?.data ?? res.data));
  },

  async remove(id) {
    return api.delete(`/products/${id}`);
  }
};

export default productsAPI;