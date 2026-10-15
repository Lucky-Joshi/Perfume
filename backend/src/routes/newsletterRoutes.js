import { Router } from 'express';
import { body } from 'express-validator';
import * as admin from '../controllers/adminController.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/', validate([body('email').isEmail().withMessage('A valid email is required.')]), admin.subscribeNewsletter);
router.post('/unsubscribe', admin.unsubscribeNewsletter);

export default router;