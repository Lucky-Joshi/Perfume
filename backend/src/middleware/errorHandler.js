import AppError from '../utils/AppError.js';

/**
 * Centralized error handler.
 * - Operational errors (AppError) → clean HTTP response.
 * - Supabase / Postgres errors → 400/500 mapped.
 * - Anything else → 500, logged.
 * In production the stack is never leaked.
 */
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message = `Upload error: ${err.message}`;
  } else if (err.code === '23505') {
    statusCode = 409;
    message = 'A record with that value already exists.';
  } else if (err.code && String(err.code).startsWith('23')) {
    statusCode = 400;
    message = 'Database constraint violation.';
  } else if (err instanceof SyntaxError && err.status === 400) {
    statusCode = 400;
    message = 'Invalid JSON payload.';
  } else if (err.message?.includes('fetch failed') || err.message?.includes('ECONNREFUSED')) {
    statusCode = 503;
    message = 'Database is unreachable. Check your Supabase configuration.';
  } else {
    console.error('[error]', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}