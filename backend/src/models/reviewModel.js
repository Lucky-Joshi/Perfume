import { supabase } from '../config/supabase.js';

/**
 * Data access for `reviews` table.
 */
export const reviewModel = {
  async create({ product_id, user_id, rating, title, comment }) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({ product_id, user_id, rating, title, comment })
      .select('*, user:profiles(first_name, last_name)')
      .single();
    if (error) throw error;
    return data;
  },

  async hasReviewed(userId, productId) {
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  },

  async findForProduct(productId, { page = 1, limit = 10 } = {}) {
    const { data, count, error } = await supabase
      .from('reviews')
      .select('*, user:profiles(first_name, last_name)', { count: 'exact' })
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  async findAll({ page, limit, status, search } = {}) {
    let query = supabase
      .from('reviews')
      .select('*, product:products(name, slug), user:profiles(first_name, last_name)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);
    if (search) query = query.or(`comment.ilike.%${search}%,title.ilike.%${search}%`);
    if (page && limit) query = query.range((page - 1) * limit, page * limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async updateProductAggregates(productId) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)
      .eq('status', 'approved');
    if (error) throw error;

    const ratings = data || [];
    const avg = ratings.length
      ? ratings.reduce((s, r) => s + Number(r.rating), 0) / ratings.length
      : 0;

    await supabase
      .from('products')
      .update({ rating: Math.round(avg * 10) / 10, reviews_count: ratings.length })
      .eq('id', productId);

    return { rating: avg, count: ratings.length };
  },

  async delete(id) {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;
  },

  async countPending() {
    const { count, error } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');
    if (error) throw error;
    return count || 0;
  }
};