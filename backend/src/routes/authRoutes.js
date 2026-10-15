import { Router } from 'express';
import { body } from 'express-validator';
import * as auth from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  authLimiter,
  validate([
    body('email').isEmail().withMessage('A valid email is required.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters.'),
    body('first_name').notEmpty().withMessage('First name is required.'),
    body('last_name').notEmpty().withMessage('Last name is required.')
  ]),
  auth.register
);

router.post(
  '/login',
  authLimiter,
  validate([
    body('email').isEmail().withMessage('A valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.')
  ]),
  auth.login
);

router.post('/refresh', auth.refresh);
router.post('/logout', protect, auth.logout);
router.get('/verify-email', auth.verifyEmail);

router.post(
  '/forgot-password',
  authLimiter,
  validate([body('email').isEmail().withMessage('A valid email is required.')]),
  auth.forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  validate([
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
  ]),
  auth.resetPassword
);

export default router;