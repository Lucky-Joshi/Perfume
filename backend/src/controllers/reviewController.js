import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted } from '../utils/response.js';
import { reviewService } from '../services/index.js';
import { activityService } from '../services/activityService.js';

export const addReview = asyncHandler(async (req, res) => {
  const review = await reviewService.addReview(req.user.id, { ...req.body, productId: req.params.productId });
  created(res, review, 'Review submitted. It will appear after moderation.');
});

export const productReviews = asyncHandler(async (req, res) => {
  const { reviews, meta } = await reviewService.listForProduct(req.params.productId, req.query);
  success(res, reviews, 'Reviews fetched.', 200, meta);
});

export const adminListReviews = asyncHandler(async (req, res) => {
  const { reviews, meta } = await reviewService.adminList(req.query);
  success(res, reviews, 'Reviews fetched.', 200, meta);
});

export const moderateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.moderate(req.params.id, req.body.status);
  await activityService.log({ admin_id: req.user.id, action: `review_${req.body.status}`, entity: 'review', entity_id: req.params.id });
  success(res, review, 'Review updated.');
});

export const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.delete(req.params.id);
  await activityService.log({ admin_id: req.user.id, action: 'review_deleted', entity: 'review', entity_id: req.params.id });
  deleted(res, 'Review deleted.');
});