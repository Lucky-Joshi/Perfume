import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { admin as adminGuard } from '../middleware/admin.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { uploadProductImages } from '../middleware/upload.js';

import * as admin from '../controllers/adminController.js';
import * as product from '../controllers/productController.js';
import * as category from '../controllers/categoryController.js';
import * as order from '../controllers/orderController.js';
import * as user from '../controllers/userController.js';
import * as review from '../controllers/reviewController.js';

const router = Router();

/* ---- Public ---- */
router.post('/login', authLimiter, admin.adminLogin);

/* ---- Protected: every route below requires an admin ---- */
router.use(protect, adminGuard);

router.get('/dashboard', admin.adminDashboard);
router.get('/me', admin.me);
router.put('/password', validate([
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters.')
]), admin.adminChangePassword);

/* ---- Products ---- */
router.get('/products', product.listProducts);
router.post('/products', uploadProductImages, product.createProduct);
router.put('/products/:id', uploadProductImages, product.updateProduct);
router.delete('/products/:id', product.deleteProduct);

/* ---- Categories ---- */
router.get('/categories', category.listCategories);
router.post('/categories', validate([body('name').notEmpty().withMessage('Category name is required.')]), category.createCategory);
router.put('/categories/:id', validate([body('name').notEmpty().withMessage('Category name is required.')]), category.updateCategory);
router.delete('/categories/:id', category.deleteCategory);

/* ---- Orders ---- */
router.get('/orders', order.adminListOrders);
router.put('/orders/:id/status', validate([body('status').notEmpty().withMessage('Status is required.')]), order.adminUpdateOrderStatus);

/* ---- Users ---- */
router.get('/users', user.adminListUsers);
router.patch('/users/:id/status', validate([body('status').notEmpty().withMessage('Status is required.')]), user.adminUpdateUserStatus);
router.patch('/users/:id/role', validate([body('role').notEmpty().withMessage('Role is required.')]), user.adminUpdateUserRole);
router.delete('/users/:id', user.adminDeleteUser);

/* ---- Reviews ---- */
router.get('/reviews', review.adminListReviews);
router.put('/reviews/:id/status', validate([body('status').notEmpty().withMessage('Status is required.')]), review.moderateReview);
router.delete('/reviews/:id', review.deleteReview);

/* ---- Contact messages ---- */
router.get('/messages', admin.adminListMessages);
router.patch('/messages/:id/read', admin.markMessageRead);
router.delete('/messages/:id', admin.adminDeleteMessage);

/* ---- Newsletter ---- */
router.get('/newsletter', admin.adminListNewsletter);
router.delete('/newsletter/:id', admin.adminDeleteNewsletter);

/* ---- Settings ---- */
router.get('/settings', admin.adminSettings);
router.put('/settings', admin.adminUpdateSettings);

export default router;