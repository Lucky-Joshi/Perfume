import { Router } from 'express';
import { body } from 'express-validator';
import * as user from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.get('/me', user.getProfile);
router.put('/me', user.updateProfile);
router.put(
  '/me/password',
  validate([
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters.')
  ]),
  user.changePassword
);

export default router;