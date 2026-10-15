import { v4 as uuidv4 } from 'uuid';
import AppError from '../utils/AppError.js';
import { paginate, totalPages } from '../utils/paginate.js';
import { orderModel } from '../models/orderModel.js';
import { cartModel } from '../models/cartModel.js';
import { productModel } from '../models/productModel.js';
import { activityService } from './activityService.js';

export const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export const orderService = {
  /**
   * Place an order from the authenticated user's cart.
   * If `buyNow` items are supplied they are used instead.
   */
  async checkout(userId, { cartId = null, shipping = {}, payment = {} }) {
    const cartItems = await cartModel.getByUser(userId);
    if (!cartItems.length) throw new AppError('Your cart is empty.', 400);

    // Enrich items and verify stock.
    const items = [];
    let subtotal = 0;

    for (const item of cartItems) {
      const product = await productModel.findAdminById(item.product_id);
      if (!product) throw new AppError(`A product in your cart is no longer available.`, 400);
      if (product.stock < item.quantity) {
        throw new AppError(`Not enough stock for "${product.name}".`, 400);
      }

      const unitPrice = Number(product.discount_price || product.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      items.push({
        product_id: item.product_id,
        variant: item.size,
        product_name: product.name,
        unit_price: unitPrice,
        quantity: item.quantity,
        line_total: lineTotal,
        image: product.images?.[0] || null
      });
    }

    const shippingCost = Number(shipping.cost || 0);
    const discount = Number(payment.discount || 0);
    const total = subtotal + shippingCost - discount;

    const orderId = `EA-${uuidv4().slice(0, 10).toUpperCase()}`;

    const order = await orderModel.create({
      id: orderId,
      user_id: userId,
      status: 'pending',
      subtotal,
      shipping_cost: shippingCost,
      discount,
      total_amount: total,
      shipping_address: shipping.address || null,
      shipping_city: shipping.city || null,
      shipping_country: shipping.country || null,
      payment_method: payment.method || 'cod',
      payment_status: payment.method === 'card' ? 'paid' : 'pending'
    });

    await orderModel.createItems(items.map((i) => ({ ...i, order_id: orderId })));

    // Decrement stock and clear the cart.
    for (const i of items) {
      const product = await productModel.findAdminById(i.product_id);
      await productModel.update(i.product_id, { stock: Math.max(0, product.stock - i.quantity) });
    }
    await cartModel.clear(userId);

    await activityService.log({ user_id: userId, action: 'order_placed', entity: 'order', entity_id: orderId });

    return { order, items };
  },

  async getUserOrders(userId, query = {}) {
    const { page = 1, limit = 10 } = query;
    const result = await orderModel.findByUserId(userId, { page: Number(page), limit: Number(limit) });
    const { page: p, limit: l } = paginate(page, limit);
    return {
      orders: result.data,
      meta: { total: result.count, page: p, limit: l, pages: totalPages(result.count, l) }
    };
  },

  async getOrder(userId, orderId) {
    const order = await orderModel.findById(orderId);
    if (!order) throw new AppError('Order not found.', 404);
    if (order.user_id !== userId) throw new AppError('You do not have access to this order.', 403);
    return order;
  },

  async cancelOrder(userId, orderId) {
    const order = await orderModel.findById(orderId);
    if (!order) throw new AppError('Order not found.', 404);
    if (order.user_id !== userId) throw new AppError('You do not have access to this order.', 403);
    if (order.status !== 'pending') {
      throw new AppError('Only pending orders can be cancelled.', 400);
    }

    // Restore stock.
    for (const item of order.items || []) {
      const product = await productModel.findAdminById(item.product_id);
      if (product) {
        await productModel.update(item.product_id, { stock: product.stock + item.quantity });
      }
    }

    return orderModel.updateStatus(orderId, 'cancelled');
  },

  async adminList(query = {}) {
    const { page = 1, limit = 10 } = query;
    const result = await orderModel.findAll({
      page: Number(page),
      limit: Number(limit),
      status: query.status,
      search: query.search
    });
    const { page: p, limit: l } = paginate(page, limit);
    return {
      orders: result.data,
      meta: { total: result.count, page: p, limit: l, pages: totalPages(result.count, l) }
    };
  },

  async adminUpdateStatus(orderId, status) {
    if (!orderStatuses.includes(status)) {
      throw new AppError('Invalid order status.', 400);
    }
    const order = await orderModel.findById(orderId);
    if (!order) throw new AppError('Order not found.', 404);
    return orderModel.updateStatus(orderId, status);
  }
};