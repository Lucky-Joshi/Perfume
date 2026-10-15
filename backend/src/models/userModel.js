import { supabase } from '../config/supabase.js';

/**
 * Data access for `users` and `profiles` tables.
 */
export const userModel = {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findByEmailWithProfile(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*, profile:profiles(*)')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*, profile:profiles(*)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create({ email, password_hash, role = 'user', email_verified = false }) {
    const { data, error } = await supabase
      .from('users')
      .insert({ email, password_hash, role, email_verified })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, fields) {
    const { data, error } = await supabase
      .from('users')
      .update(fields)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async updateRefreshToken(id, refreshToken) {
    return this.update(id, { refresh_token: refreshToken });
  },

  async findAll({ page, limit, search, status }) {
    let query = supabase.from('users').select('*, profile:profiles(*)', { count: 'exact' });

    if (search) {
      // Names live in `profiles` (an embedded table) which cannot be mixed
      // with top-level columns inside a single PostgREST `.or()`, so admin
      // search is performed against the top-level `email` column only.
      query = query.or(`email.ilike.%${search}%`);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (page && limit) {
      query = query.range((page - 1) * limit, page * limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  async findAllEmails() {
    const { data, error } = await supabase.from('users').select('email');
    if (error) throw error;
    return data || [];
  },

  async deleteById(id) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
  },

  async countAll() {
    const { count, error } = await supabase.from('users').select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  }
};

/**
 * Data access for `profiles` table (one-to-one with users).
 */
export const profileModel = {
  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create({ userId, first_name, last_name, phone, address, city, country }) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ user_id: userId, first_name, last_name, phone, address, city, country })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async update(userId, fields) {
    const { data, error } = await supabase
      .from('profiles')
      .update(fields)
      .eq('user_id', userId)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }
};