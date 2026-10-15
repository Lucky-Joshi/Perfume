import AppError from '../utils/AppError.js';
import { slugify } from '../utils/slugify.js';
import { paginate, totalPages } from '../utils/paginate.js';
import { productModel } from '../models/productModel.js';

export const productService = {
  async listProducts(query = {}) {
    const { page = 1, limit = 12 } = query;
    const result = await productModel.findAll({
      page: Number(page),
      limit: Number(limit),
      gender: query.gender,
      category: query.category,
      search: query.search,
      sort: query.sort,
      featured: query.featured,
      trending: query.trending,
      bestSeller: query.bestSeller
    });

    const { page: p, limit: l } = paginate(page, limit);
    return {
      products: result.data,
      meta: { total: result.count, page: p, limit: l, pages: totalPages(result.count, l) }
    };
  },

  async getProduct(identifier) {
    const product = /^\d+$/.test(identifier)
      ? await productModel.findById(Number(identifier))
      : await productModel.findBySlug(identifier);

    if (!product) throw new AppError('Product not found.', 404);
    return product;
  },

  async createProduct(payload, files = []) {
    const price = Number(payload.price);
    const discount_price = payload.discount_price ? Number(payload.discount_price) : 0;
    const newImages = files.map((f) => `/uploads/products/${f.filename}`);
    const images = mergeImages(payload.existingImages, newImages);

    const row = await productModel.create({
      name: payload.name,
      slug: slugify(payload.name) + '-' + Math.floor(Math.random() * 9999),
      description: payload.description || '',
      price,
      discount_price,
      brand: payload.brand || 'Essence Aura',
      category_id: payload.category_id || null,
      gender: payload.gender || 'unisex',
      fragrance_family: payload.fragrance_family || '',
      top_notes: parseList(payload.top_notes),
      middle_notes: parseList(payload.middle_notes),
      base_notes: parseList(payload.base_notes),
      sizes: parseList(payload.sizes),
      stock: Number(payload.stock || 0),
      images,
      featured: toBool(payload.featured),
      trending: toBool(payload.trending),
      best_seller: toBool(payload.bestSeller || payload.best_seller)
    });

    return row;
  },

  async updateProduct(id, payload, files = []) {
    const existing = await productModel.findAdminById(id);
    if (!existing) throw new AppError('Product not found.', 404);

    const newImages = files.map((f) => `/uploads/products/${f.filename}`);
    const images = mergeImages(payload.existingImages, newImages, existing.images);

    const row = await productModel.update(id, {
      name: payload.name ?? existing.name,
      slug: payload.name ? slugify(payload.name) : existing.slug,
      description: payload.description ?? existing.description,
      price: payload.price != null ? Number(payload.price) : existing.price,
      discount_price: payload.discount_price != null ? Number(payload.discount_price) : existing.discount_price,
      brand: payload.brand ?? existing.brand,
      category_id: payload.category_id ?? existing.category_id,
      gender: payload.gender ?? existing.gender,
      fragrance_family: payload.fragrance_family ?? existing.fragrance_family,
      top_notes: payload.top_notes ? parseList(payload.top_notes) : existing.top_notes,
      middle_notes: payload.middle_notes ? parseList(payload.middle_notes) : existing.middle_notes,
      base_notes: payload.base_notes ? parseList(payload.base_notes) : existing.base_notes,
      sizes: payload.sizes ? parseList(payload.sizes) : existing.sizes,
      stock: payload.stock != null ? Number(payload.stock) : existing.stock,
      images,
      featured: payload.featured != null ? toBool(payload.featured) : existing.featured,
      trending: payload.trending != null ? toBool(payload.trending) : existing.trending,
      best_seller: payload.bestSeller != null ? toBool(payload.bestSeller) : existing.best_seller
    });

    return row;
  },

  async deleteProduct(id) {
    const existing = await productModel.findAdminById(id);
    if (!existing) throw new AppError('Product not found.', 404);
    await productModel.delete(id);
    return existing;
  }
};

/** Parse comma-separated or JSON string list into an array of strings. */
function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch { /* fallthrough */ }
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function toBool(value) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

/** Merge comma-separated existing image URLs with newly uploaded files. */
function mergeImages(existing, newImages, fallback = []) {
  const list = existing
    ? String(existing).split(',').map((s) => s.trim()).filter(Boolean)
    : (Array.isArray(fallback) ? fallback : []);
  return [...list, ...newImages];
}