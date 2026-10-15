/**
 * AppError — an HTTP-aware error with a status code.
 * Thrown inside services/controllers and handled by the global error handler.
 */
export default class AppError extends Error {
  constructor(message, statusCode = 400, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.data = data;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}