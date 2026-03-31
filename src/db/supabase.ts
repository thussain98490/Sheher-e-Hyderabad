
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function getSupabaseInitError() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Supabase environment variables are missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
  }

  try {
    new URL(supabaseUrl);
  } catch {
    return 'VITE_SUPABASE_URL is not a valid URL.';
  }

  return null;
}

export const supabaseInitError = getSupabaseInitError();

if (supabaseInitError) {
  console.error('Supabase initialization error:', supabaseInitError);
}

const fallbackSupabaseUrl = 'https://placeholder.supabase.co';
const fallbackSupabaseAnonKey = 'placeholder-anon-key';

export const supabase = createClient(
  supabaseInitError ? fallbackSupabaseUrl : supabaseUrl,
  supabaseInitError ? fallbackSupabaseAnonKey : supabaseAnonKey,
);
