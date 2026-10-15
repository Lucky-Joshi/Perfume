import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted } from '../utils/response.js';
import { categoryService } from '../services/index.js';
import { activityService } from '../services/activityService.js';

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories();
  success(res, categories, 'Categories fetched.');
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  await activityService.log({ admin_id: req.user.id, action: 'category_created', entity: 'category', entity_id: category.id });
  created(res, category, 'Category created.');
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  await activityService.log({ admin_id: req.user.id, action: 'category_updated', entity: 'category', entity_id: category.id });
  success(res, category, 'Category updated.');
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.deleteCategory(req.params.id);
  await activityService.log({ admin_id: req.user.id, action: 'category_deleted', entity: 'category', entity_id: req.params.id });
  deleted(res, 'Category deleted.');
});