import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "[supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env"
  );
}

/**
 * Singleton Supabase client for the frontend.
 *
 * Configuration notes:
 * - autoRefreshToken: true  → Supabase auto-refreshes the JWT before expiry
 * - persistSession:   true  → Session is stored in localStorage automatically
 * - detectSessionInUrl: true → Handles the email verification redirect token
 *   (Supabase appends #access_token=... to the URL after email confirmation)
 */
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
