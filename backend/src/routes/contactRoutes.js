import { Router } from 'express';
import { body } from 'express-validator';
import * as admin from '../controllers/adminController.js';
import { validate } from '../middleware/validate.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public contact form + newsletter
router.post(
  '/contact',
  contactLimiter,
  validate([
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('A valid email is required.'),
    body('subject').notEmpty().withMessage('Subject is required.'),
    body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters.')
  ]),
  admin.submitContactMessage
);

export default router;