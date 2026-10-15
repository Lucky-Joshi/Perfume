import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase credentials are missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
}

/**
 * Service-role client — bypasses Row Level Security.
 * Only ever used server-side (never expose the service key to the browser).
 */
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey);