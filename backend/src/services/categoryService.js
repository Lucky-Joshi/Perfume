import AppError from '../utils/AppError.js';
import { slugify } from '../utils/slugify.js';
import { categoryModel } from '../models/categoryModel.js';
import { productModel } from '../models/productModel.js';

export const categoryService = {
  async listCategories() {
    return categoryModel.findAll();
  },

  async createCategory(payload) {
    const existing = await categoryModel.findBySlug(slugify(payload.name));
    if (existing) throw new AppError('A category with this name already exists.', 409);

    return categoryModel.create({
      name: payload.name,
      slug: slugify(payload.name),
      description: payload.description || '',
      image: payload.image || null
    });
  },

  async updateCategory(id, payload) {
    const existing = await categoryModel.findById(id);
    if (!existing) throw new AppError('Category not found.', 404);

    return categoryModel.update(id, {
      name: payload.name ?? existing.name,
      slug: payload.name ? slugify(payload.name) : existing.slug,
      description: payload.description ?? existing.description,
      image: payload.image ?? existing.image
    });
  },

  async deleteCategory(id) {
    const existing = await categoryModel.findById(id);
    if (!existing) throw new AppError('Category not found.', 404);

    const products = await productModel.findAll({ page: 1, limit: 1, category: id });
    if (products.count > 0) {
      throw new AppError('Cannot delete a category that still has products.', 409);
    }

    await categoryModel.delete(id);
    return existing;
  }
};