/**
 * Reusable response helpers. Every API response flows through these
 * so the client always receives a consistent shape:
 *
 *   { success, message?, data?, meta? }
 */
export function success(res, data = null, message = 'Success', statusCode = 200, meta = null) {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function created(res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201);
}

export function deleted(res, message = 'Deleted successfully') {
  return success(res, null, message, 200);
}

export function listSuccess(res, data, { total, page, limit, pages } = {}, message = 'Fetched successfully') {
  return success(res, data, message, 200, {
    total,
    page,
    limit,
    pages
  });
}

export function error(res, message = 'Something went wrong', statusCode = 400) {
  return res.status(statusCode).json({ success: false, message, data: null });
}