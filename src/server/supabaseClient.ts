import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy Supabase client initialization, same pattern as the Gemini/Resend
// clients in handlers.ts: absent credentials simply mean the feature that
// needs persistence (member storage + login) degrades gracefully instead of
// crashing the server.
let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    // Service role key is required (not the anon key): registration/login run
    // server-side only and need to bypass row-level security to read/write
    // the members table directly.
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      supabase = createClient(url, key, {
        auth: { persistSession: false },
      });
    }
  }
  return supabase;
}
