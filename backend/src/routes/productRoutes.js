import { Router } from 'express';
import * as product from '../controllers/productController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { uploadProductImages } from '../middleware/upload.js';

const router = Router();

// Public catalog
router.get('/', optionalAuth, product.listProducts);
router.get('/:identifier', product.getProduct);

// Admin CRUD
router.post('/', protect, admin, uploadProductImages, product.createProduct);
router.put('/:id', protect, admin, uploadProductImages, product.updateProduct);
router.delete('/:id', protect, admin, product.deleteProduct);

export default router;