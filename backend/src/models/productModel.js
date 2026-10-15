import { supabase } from '../config/supabase.js';

/**
 * Data access for `products` table.
 * Public/lists read from the flattened `catalog` SQL view.
 * Writes target the `products` table.
 */
export const productModel = {
  async create(data) {
    const { data: row, error } = await supabase
      .from('products')
      .insert(data)
      .select('*')
      .single();
    if (error) throw error;
    return row;
  },

  async update(id, data) {
    const { data: row, error } = await supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return row;
  },

  async delete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  async findById(id) {
    const { data, error } = await supabase.from('catalog').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },

  async findBySlug(slug) {
    const { data, error } = await supabase.from('catalog').select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    return data;
  },

  async findAdminById(id) {
    const { data, error } = await supabase.from('products').select('*, category:categories(*)').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },

  async findAll({ page, limit, gender, category, search, sort, featured, trending, bestSeller }) {
    let query = supabase.from('catalog').select('*', { count: 'exact' });

    if (gender && gender !== 'all') query = query.eq('gender', gender);
    if (category && category !== 'all') query = query.eq('category_id', category);
    if (search) query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`);
    if (featured === 'true' || featured === true) query = query.eq('featured', true);
    if (trending === 'true' || trending === true) query = query.eq('trending', true);
    if (bestSeller === 'true' || bestSeller === true) query = query.eq('best_seller', true);

    if (sort) {
      const field = sort.startsWith('-') ? sort.slice(1) : sort;
      const ascending = !sort.startsWith('-');
      query = query.order(field, { ascending });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    if (page && limit) {
      query = query.range((page - 1) * limit, page * limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  async countAll() {
    const { count, error } = await supabase.from('products').select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  }
};