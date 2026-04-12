import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase environment variables. Check SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY in your .env"
  );
}

/**
 * anonClient — for public-facing operations.
 * Respects RLS. Use for client-facing reads (properties, images).
 */
export const anonClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * adminClient — uses the service role key.
 * BYPASSES RLS. Use ONLY inside trusted, authenticated admin controllers.
 * Never expose this client to the frontend.
 */
export const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
