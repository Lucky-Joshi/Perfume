import { Router } from 'express';
import * as wishlist from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', wishlist.getWishlist);
router.post('/:productId', wishlist.addToWishlist);
router.delete('/:productId', wishlist.removeFromWishlist);

export default router;