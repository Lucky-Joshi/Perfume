import { asyncHandler } from '../utils/asyncHandler.js';
import { success, deleted } from '../utils/response.js';
import { userService } from '../services/index.js';
import { activityService } from '../services/activityService.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.id);
  success(res, profile, 'Profile fetched.');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateProfile(req.user.id, req.body);
  await activityService.log({ user_id: req.user.id, action: 'profile_updated', entity: 'profile', entity_id: req.user.id });
  success(res, profile, 'Profile updated.');
});

export const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  await activityService.log({ user_id: req.user.id, action: 'password_changed', entity: 'user', entity_id: req.user.id });
  success(res, null, 'Password changed successfully.');
});

export const adminListUsers = asyncHandler(async (req, res) => {
  const { users, meta } = await userService.adminList(req.query);
  success(res, users, 'Users fetched.', 200, meta);
});

export const adminUpdateUserStatus = asyncHandler(async (req, res) => {
  const result = await userService.adminUpdateStatus(req.params.id, req.body.status);
  await activityService.log({ admin_id: req.user.id, action: `user_${req.body.status}`, entity: 'user', entity_id: req.params.id });
  success(res, result, 'User status updated.');
});

export const adminUpdateUserRole = asyncHandler(async (req, res) => {
  const result = await userService.adminUpdateRole(req.params.id, req.body.role);
  await activityService.log({ admin_id: req.user.id, action: `user_role_${req.body.role}`, entity: 'user', entity_id: req.params.id });
  success(res, result, 'User role updated.');
});

export const adminDeleteUser = asyncHandler(async (req, res) => {
  await userService.adminDelete(req.params.id);
  await activityService.log({ admin_id: req.user.id, action: 'user_deleted', entity: 'user', entity_id: req.params.id });
  deleted(res, 'User deleted.');
});