import { Router } from 'express';
import { body } from 'express-validator';
import * as cart from '../controllers/cartController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', cart.getCart);
router.post(
  '/',
  validate([body('productId').notEmpty().withMessage('Product id is required.')]),
  cart.addToCart
);
router.put('/:itemId', validate([body('quantity').isNumeric().withMessage('Quantity must be a number.')]), cart.updateCartItem);
router.delete('/:itemId', cart.removeCartItem);
router.delete('/', cart.clearCart);

export default router;