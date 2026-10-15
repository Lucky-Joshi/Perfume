import { supabase } from '../config/supabase.js';

/**
 * Data access for `settings` table (key-value store) and `activity_logs`.
 */
export const settingsModel = {
  async getAll() {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;
    return (data || []).reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  },

  async set(key, value) {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }
};

export const activityModel = {
  async log({ user_id, admin_id, action, entity, entity_id, meta = null }) {
    const { error } = await supabase.from('activity_logs').insert({
      user_id,
      admin_id,
      action,
      entity,
      entity_id,
      meta
    });
    if (error) console.error('[activity] failed to log:', error);
  },

  async findAll({ limit = 30 } = {}) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*, admin:admins(display_name), user:profiles(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }
};