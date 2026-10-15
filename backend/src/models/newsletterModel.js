import { supabase } from '../config/supabase.js';

/**
 * Data access for `newsletter` table.
 */
export const newsletterModel = {
  async create(email) {
    const { data, error } = await supabase
      .from('newsletter')
      .insert({ email })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('newsletter')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findAll({ page, limit } = {}) {
    let query = supabase
      .from('newsletter')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    if (page && limit) query = query.range((page - 1) * limit, page * limit - 1);
    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  async remove(id) {
    const { error } = await supabase.from('newsletter').delete().eq('id', id);
    if (error) throw error;
  },

  async unsubscribe(email) {
    const { error } = await supabase.from('newsletter').delete().eq('email', email);
    if (error) throw error;
  },

  async countAll() {
    const { count, error } = await supabase
      .from('newsletter')
      .select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  }
};