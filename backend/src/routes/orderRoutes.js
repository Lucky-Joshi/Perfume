import { Router } from 'express';
import { body } from 'express-validator';
import * as order from '../controllers/orderController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

// Customer routes
router.post(
  '/checkout',
  protect,
  validate([
    body('shipping.address').notEmpty().withMessage('Shipping address is required.'),
    body('shipping.city').notEmpty().withMessage('Shipping city is required.'),
    body('shipping.country').notEmpty().withMessage('Shipping country is required.')
  ]),
  order.checkout
);

router.get('/my-orders', protect, order.myOrders);
router.get('/my-orders/:id', protect, order.myOrder);
router.post('/:id/cancel', protect, order.cancelOrder);

// Admin routes
router.get('/', protect, admin, order.adminListOrders);
router.put('/:id/status', protect, admin, validate([body('status').notEmpty().withMessage('Status is required.')]), order.adminUpdateOrderStatus);

export default router;