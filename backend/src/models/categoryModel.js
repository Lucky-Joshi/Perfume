import { supabase } from '../config/supabase.js';

/**
 * Data access for `categories` table.
 */
export const categoryModel = {
  async findAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async findById(id) {
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },

  async findBySlug(slug) {
    const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    return data;
  },

  async create({ name, slug, description, image }) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, slug, description, image })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, fields) {
    const { data, error } = await supabase
      .from('categories')
      .update(fields)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },

  async countAll() {
    const { count, error } = await supabase.from('categories').select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  }
};