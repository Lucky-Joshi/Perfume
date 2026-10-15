import { Router } from 'express';
import { body } from 'express-validator';
import * as review from '../controllers/reviewController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

// Public: approved reviews for a product
router.get('/product/:productId', review.productReviews);

// User: submit a review
router.post(
  '/product/:productId',
  protect,
  validate([
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('comment').isLength({ min: 5 }).withMessage('Comment must be at least 5 characters.')
  ]),
  review.addReview
);

// Admin
router.get('/', protect, admin, review.adminListReviews);
router.put('/:id/status', protect, admin, validate([body('status').notEmpty().withMessage('Status is required.')]), review.moderateReview);
router.delete('/:id', protect, admin, review.deleteReview);

export default router;