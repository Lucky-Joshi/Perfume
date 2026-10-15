import AppError from '../utils/AppError.js';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Role-based access control. Must run AFTER `protect`.
 * Only users with role === 'admin' (or an admins table row) may continue.
 */
export const admin = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'admin') return next();

  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', req.user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new AppError('Admin access required.', 403);
  }

  req.user.role = 'admin';
  next();
});