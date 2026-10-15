import AppError from '../utils/AppError.js';
import { wishlistModel } from '../models/cartModel.js';
import { productModel } from '../models/productModel.js';

export const wishlistService = {
  async getWishlist(userId) {
    return wishlistModel.getByUser(userId);
  },

  async toggle(userId, productId) {
    const product = await productModel.findAdminById(productId);
    if (!product) throw new AppError('Product not found.', 404);

    const res = await wishlistModel.add(userId, productId);
    if (res.already) {
      await wishlistModel.remove(userId, productId);
      return { inWishlist: false };
    }
    return { inWishlist: true };
  },

  async add(userId, productId) {
    const product = await productModel.findAdminById(productId);
    if (!product) throw new AppError('Product not found.', 404);
    return wishlistModel.add(userId, productId);
  },

  async remove(userId, productId) {
    await wishlistModel.remove(userId, productId);
  }
};