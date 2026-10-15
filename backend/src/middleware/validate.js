import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

/**
 * Runs express-validator rules then throws a 422 AppError
 * with the first validation message when the input is invalid.
 */
export const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const message = result.array()[0]?.msg || 'Invalid input';
      return next(new AppError(message, 422));
    }
    next();
  }
];

export default validate;