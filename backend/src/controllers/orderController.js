import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created } from '../utils/response.js';
import { orderService } from '../services/index.js';
import { activityService } from '../services/activityService.js';

export const checkout = asyncHandler(async (req, res) => {
  const result = await orderService.checkout(req.user.id, req.body);
  created(res, result, 'Order placed successfully.');
});

export const myOrders = asyncHandler(async (req, res) => {
  const { orders, meta } = await orderService.getUserOrders(req.user.id, req.query);
  success(res, orders, 'Orders fetched.', 200, meta);
});

export const myOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(req.user.id, req.params.id);
  success(res, order, 'Order fetched.');
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.user.id, req.params.id);
  await activityService.log({ user_id: req.user.id, action: 'order_cancelled', entity: 'order', entity_id: req.params.id });
  success(res, order, 'Order cancelled.');
});

export const adminListOrders = asyncHandler(async (req, res) => {
  const { orders, meta } = await orderService.adminList(req.query);
  success(res, orders, 'Orders fetched.', 200, meta);
});

export const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.adminUpdateStatus(req.params.id, req.body.status);
  await activityService.log({ admin_id: req.user.id, action: `order_${req.body.status}`, entity: 'order', entity_id: req.params.id });
  success(res, order, 'Order status updated.');
});