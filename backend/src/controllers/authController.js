import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created } from '../utils/response.js';
import { cookieNames, refreshCookieOptions } from '../utils/jwt.js';
import { authService } from '../services/index.js';
import { activityService } from '../services/activityService.js';

const setRefreshCookie = (res, refreshToken, rememberMe) => {
  if (rememberMe) {
    res.cookie(cookieNames.refresh, refreshToken, refreshCookieOptions());
  }
};

export const register = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.register(req.body);

  await activityService.log({ user_id: user.id, action: 'user_registered', entity: 'user', entity_id: user.id });

  // Always send the access token in the body; the refresh cookie is optional.
  setRefreshCookie(res, tokens.refreshToken, req.body.rememberMe);
  created(res, { user, tokens }, 'Account created. Please verify your email.');
});

export const login = asyncHandler(async (req, res) => {
  const { user, tokens, rememberMe } = await authService.login(req.body);
  setRefreshCookie(res, tokens.refreshToken, rememberMe);
  success(res, { user, tokens }, 'Login successful.');
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies[cookieNames.refresh];
  const { user, tokens } = await authService.refresh(refreshToken);
  setRefreshCookie(res, tokens.refreshToken, true);
  success(res, { user, tokens }, 'Token refreshed.');
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies[cookieNames.refresh];
  await authService.logout(req.user?.id, refreshToken);
  res.clearCookie(cookieNames.refresh, refreshCookieOptions());
  success(res, null, 'Logged out successfully.');
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.query.token);
  success(res, { user }, 'Email verified successfully.');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  success(res, null, 'If that email exists, a reset link has been sent.');
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword({ token: req.query.token || req.body.token, newPassword: req.body.newPassword });
  success(res, null, 'Password has been reset. You can now log in.');
});