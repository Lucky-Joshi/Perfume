import { Router } from 'express';
import { body } from 'express-validator';
import * as category from '../controllers/categoryController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = Router();

router.get('/', category.listCategories);

router.post(
  '/',
  protect,
  admin,
  validate([body('name').notEmpty().withMessage('Category name is required.')]),
  category.createCategory
);

router.put(
  '/:id',
  protect,
  admin,
  validate([body('name').notEmpty().withMessage('Category name is required.')]),
  category.updateCategory
);

router.delete('/:id', protect, admin, category.deleteCategory);

export default router;