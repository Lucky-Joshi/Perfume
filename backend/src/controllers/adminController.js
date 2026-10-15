import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted } from '../utils/response.js';
import { contactService, newsletterService, adminService } from '../services/index.js';
import { activityService } from '../services/activityService.js';
import { authService } from '../services/authService.js';
import { userService } from '../services/userService.js';
import AppError from '../utils/AppError.js';
import { refreshCookieOptions } from '../utils/jwt.js';

/* ---------------- Contact (public) ---------------- */

export const submitContactMessage = asyncHandler(async (req, res) => {
  const message = await contactService.submit(req.body);
  created(res, message, 'Message sent successfully.');
});

export const adminListMessages = asyncHandler(async (req, res) => {
  const { messages, meta } = await contactService.adminList(req.query);
  success(res, messages, 'Messages fetched.', 200, meta);
});

export const markMessageRead = asyncHandler(async (req, res) => {
  const message = await contactService.markRead(req.params.id);
  success(res, message, 'Message marked as read.');
});

export const adminDeleteMessage = asyncHandler(async (req, res) => {
  await contactService.delete(req.params.id);
  await activityService.log({ admin_id: req.user.id, action: 'message_deleted', entity: 'contact_message', entity_id: req.params.id });
  deleted(res, 'Message deleted.');
});

/* ---------------- Newsletter (public + admin) ---------------- */

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const result = await newsletterService.subscribe(req.body.email);
  success(res, result, result.already ? 'You are already subscribed.' : 'Subscribed successfully.');
});

export const unsubscribeNewsletter = asyncHandler(async (req, res) => {
  await newsletterService.unsubscribe(req.body.email || req.query.email);
  success(res, null, 'Unsubscribed successfully.');
});

export const adminListNewsletter = asyncHandler(async (req, res) => {
  const { subscribers, meta } = await newsletterService.adminList(req.query);
  success(res, subscribers, 'Subscribers fetched.', 200, meta);
});

export const adminDeleteNewsletter = asyncHandler(async (req, res) => {
  await newsletterService.adminDelete(req.params.id);
  deleted(res, 'Subscriber removed.');
});

/* ---------------- Admin dashboard & settings ---------------- */

export const adminDashboard = asyncHandler(async (req, res) => {
  const data = await adminService.dashboard();
  success(res, data, 'Dashboard data fetched.');
});

export const adminSettings = asyncHandler(async (req, res) => {
  const settings = await adminService.getSettings();
  success(res, settings, 'Settings fetched.');
});

export const adminUpdateSettings = asyncHandler(async (req, res) => {
  const settings = await adminService.updateSettings(req.body);
  await activityService.log({ admin_id: req.user.id, action: 'settings_updated', entity: 'settings', entity_id: null });
  success(res, settings, 'Settings updated.');
});

export const adminChangePassword = asyncHandler(async (req, res) => {
  await adminService.changePassword(req.user.id, req.body);
  success(res, null, 'Password changed successfully.');
});

export const me = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.id);
  success(res, profile, 'Authenticated user.');
});

export const adminLogin = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  if (result.user.role !== 'admin') {
    throw new AppError('Admin access required.', 403);
  }
  res.cookie('ea_refresh', result.tokens.refreshToken, refreshCookieOptions());
  success(res, result, 'Admin login successful.');
});