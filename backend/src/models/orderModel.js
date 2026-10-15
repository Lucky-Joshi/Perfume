import { supabase } from '../config/supabase.js';

/**
 * Data access for `orders` and `order_items` tables.
 */
export const orderModel = {
  async create(insert) {
    const { data, error } = await supabase.from('orders').insert(insert).select('*').single();
    if (error) throw error;
    return data;
  },

  async createItems(items) {
    const { error } = await supabase.from('order_items').insert(items);
    if (error) throw error;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(slug, name))')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findByUserId(userId, { page, limit } = {}) {
    let query = supabase
      .from('orders')
      .select('*, items:order_items(*)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (page && limit) query = query.range((page - 1) * limit, page * limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  async findAll({ page, limit, status, search } = {}) {
    let query = supabase
      .from('orders')
      .select('*, user:users(email), items:order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);
    if (search) {
      // `user.email` is an embedded column and cannot be mixed with top-level
      // columns inside a single PostgREST `.or()`, so admin search uses the
      // unique order id (EA-XXXXXXXXXX) only.
      query = query.ilike('id', `%${search}%`);
    }
    if (page && limit) query = query.range((page - 1) * limit, page * limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async countAll() {
    const { count, error } = await supabase.from('orders').select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  },

  async countByStatus(status) {
    const { count, error } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', status);
    if (error) throw error;
    return count || 0;
  },

  async totalRevenue() {
    const { data, error } = await supabase
      .from('orders')
      .select('total_amount')
      .neq('status', 'cancelled');
    if (error) throw error;
    return (data || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  },

  /** Revenue grouped by day for the last N days (chart data). */
  async revenueLastDays(days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    since.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('orders')
      .select('created_at, total_amount')
      .gte('created_at', since.toISOString())
      .neq('status', 'cancelled');

    if (error) throw error;

    const map = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      map[key] = { date: key, revenue: 0, orders: 0 };
    }

    (data || []).forEach((o) => {
      const key = (o.created_at || '').slice(0, 10);
      if (map[key]) {
        map[key].revenue += Number(o.total_amount || 0);
        map[key].orders += 1;
      }
    });

    return Object.values(map);
  }
};