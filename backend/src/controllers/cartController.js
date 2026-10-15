import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted } from '../utils/response.js';
import { cartService, wishlistService } from '../services/index.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  success(res, cart, 'Cart fetched.');
});

export const addToCart = asyncHandler(async (req, res) => {
  const result = await cartService.addItem(req.user.id, req.body);
  created(res, result, 'Added to cart.');
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const result = await cartService.updateItem(req.user.id, req.params.itemId, req.body.quantity);
  success(res, result, 'Cart updated.');
});

export const removeCartItem = asyncHandler(async (req, res) => {
  await cartService.removeItem(req.user.id, req.params.itemId);
  deleted(res, 'Item removed from cart.');
});

export const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user.id);
  deleted(res, 'Cart cleared.');
});

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.id);
  success(res, wishlist, 'Wishlist fetched.');
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const result = await wishlistService.toggle(req.user.id, req.params.productId);
  success(res, result, result.inWishlist ? 'Added to wishlist.' : 'Removed from wishlist.');
});

export const addToWishlist = asyncHandler(async (req, res) => {
  await wishlistService.add(req.user.id, req.params.productId);
  created(res, { inWishlist: true }, 'Added to wishlist.');
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  await wishlistService.remove(req.user.id, req.params.productId);
  deleted(res, 'Removed from wishlist.');
});