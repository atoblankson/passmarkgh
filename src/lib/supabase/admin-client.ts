import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Lightweight Supabase client for server-only API routes that don't need cookie-based auth.
 * Uses the anon key — safe for reading/writing admin_settings via RLS policies.
 */
export function createAdminSupabaseClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://rabaswyncatztozssvmd.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
  });
}