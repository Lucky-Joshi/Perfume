import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted } from '../utils/response.js';
import { productService } from '../services/index.js';
import { activityService } from '../services/activityService.js';

export const listProducts = asyncHandler(async (req, res) => {
  const { products, meta } = await productService.listProducts(req.query);
  success(res, products, 'Products fetched.', 200, meta);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(req.params.identifier);
  success(res, product, 'Product fetched.');
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.files || []);
  await activityService.log({ admin_id: req.user.id, action: 'product_created', entity: 'product', entity_id: product.id });
  created(res, product, 'Product created.');
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.files || []);
  await activityService.log({ admin_id: req.user.id, action: 'product_updated', entity: 'product', entity_id: product.id });
  success(res, product, 'Product updated.');
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);
  await activityService.log({ admin_id: req.user.id, action: 'product_deleted', entity: 'product', entity_id: req.params.id, meta: { name: product.name } });
  deleted(res, 'Product deleted.');
});