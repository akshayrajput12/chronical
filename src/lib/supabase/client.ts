import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Create a Supabase client for client-side usage
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};
