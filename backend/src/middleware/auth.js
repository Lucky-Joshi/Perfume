import AppError from '../utils/AppError.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Protects routes — requires a valid Bearer JWT access token.
 * Attaches `req.user = { id, email, role }`.
 */
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new AppError('Not authorized. Please log in.', 401);
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role || 'user' };
    next();
  } catch {
    throw new AppError('Session expired. Please log in again.', 401);
  }
});

/**
 * Optional auth — attaches req.user when a valid token exists,
 * but never rejects. Used by public endpoints that personalize results.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = { id: payload.sub, email: payload.email, role: payload.role || 'user' };
    } catch { /* treated as anonymous */ }
  }

  next();
});