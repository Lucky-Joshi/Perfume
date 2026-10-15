import AppError from '../utils/AppError.js';
import { cartModel } from '../models/cartModel.js';
import { productModel } from '../models/productModel.js';

export const cartService = {
  async getCart(userId) {
    return cartModel.getByUser(userId);
  },

  async addItem(userId, { productId, size, quantity = 1 }) {
    const product = await productModel.findAdminById(productId);
    if (!product) throw new AppError('Product not found.', 404);

    const sizes = product.sizes || [];
    const validSize = size || sizes[0] || 'Standard';
    if (sizes.length && !sizes.includes(validSize)) {
      throw new AppError('Selected size is not available.', 400);
    }

    const qty = Math.max(1, Number(quantity || 1));

    const existing = await cartModel.findByUserAndProduct(userId, productId, validSize);
    if (existing) {
      const updated = await cartModel.updateQuantity(existing.id, existing.quantity + qty);
      return { cartItem: updated, added: true };
    }

    const created = await cartModel.add(userId, productId, validSize, qty);
    return { cartItem: created, added: true };
  },

  async updateItem(userId, itemId, quantity) {
    const qty = Number(quantity);
    if (qty < 1) {
      await cartModel.remove(itemId);
      return { removed: true };
    }

    const updated = await cartModel.updateQuantity(itemId, qty);
    return { cartItem: updated, removed: false };
  },

  async removeItem(userId, itemId) {
    await cartModel.remove(itemId);
  },

  async clearCart(userId) {
    await cartModel.clear(userId);
  }
};