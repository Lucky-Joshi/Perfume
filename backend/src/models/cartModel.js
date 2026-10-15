import { supabase } from '../config/supabase.js';

/**
 * Data access for `cart` table.
 */
export const cartModel = {
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('cart')
      .select('*, product:products(slug, name, price, images, stock)')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async findByUserAndProduct(userId, productId, size) {
    const { data, error } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async add(userId, productId, size, quantity) {
    const { data, error } = await supabase
      .from('cart')
      .insert({ user_id: userId, product_id: productId, size, quantity })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async updateQuantity(id, quantity) {
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from('cart').delete().eq('id', id);
    if (error) throw error;
  },

  async clear(userId) {
    const { error } = await supabase.from('cart').delete().eq('user_id', userId);
    if (error) throw error;
  }
};

/**
 * Data access for `wishlist` table.
 */
export const wishlistModel = {
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, product:products(slug, name, price, images)')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  },

  async isInList(userId, productId) {
    const { data, error } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  },

  async add(userId, productId) {
    const existing = await this.isInList(userId, productId);
    if (existing) return { already: true };

    const { data, error } = await supabase
      .from('wishlist')
      .insert({ user_id: userId, product_id: productId })
      .select('*')
      .single();
    if (error) throw error;
    return { data, already: false };
  },

  async remove(userId, productId) {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;
  }
};