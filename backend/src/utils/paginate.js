/**
 * Build a Supabase range-query pagination object from page/limit.
 * Returns { from, to, page, limit, takeTotal } — `takeTotal` tells the
 * caller to also fetch count for total pages.
 */
export function paginate(query, page = 1, limit = 12) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
  const from = (p - 1) * l;
  const to = from + l - 1;

  return {
    from,
    to,
    page: p,
    limit: l
  };
}

export function totalPages(total, limit) {
  return Math.max(1, Math.ceil(total / limit));
}