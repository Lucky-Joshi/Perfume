import { supabase } from '../config/supabase.js';

/**
 * Data access for `contact_messages` table.
 */
export const contactModel = {
  async create({ name, email, phone, subject, message }) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({ name, email, phone, subject, message })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async findAll({ page, limit, is_read } = {}) {
    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (is_read === 'true') query = query.eq('is_read', true);
    if (is_read === 'false') query = query.eq('is_read', false);
    if (page && limit) query = query.range((page - 1) * limit, page * limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  async markRead(id) {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
  },

  async countUnread() {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false);
    if (error) throw error;
    return count || 0;
  }
};