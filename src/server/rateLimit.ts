import { getSupabaseClient } from "./supabaseClient.js";

export interface RateLimitRule {
  bucket: string;
  limit: number;
  windowMinutes: number;
}

// Per-IP limits for public endpoints, backed by Supabase so the count is
// shared across serverless invocations (an in-memory counter wouldn't
// survive a cold start on Vercel). Fails open if Supabase isn't configured
// or the check itself errors — a rate limiter must never be the reason a
// legitimate member can't use the site.
export async function checkRateLimit(ip: string, rule: RateLimitRule): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return true;

  const windowStart = new Date(Date.now() - rule.windowMinutes * 60_000).toISOString();

  // Opportunistic cleanup so the table doesn't grow unbounded.
  await supabase.from("rate_limit_hits").delete().lt("created_at", windowStart);

  const { count, error } = await supabase
    .from("rate_limit_hits")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .eq("bucket", rule.bucket)
    .gte("created_at", windowStart);

  if (error) {
    console.error("Rate limit check failed:", error);
    return true;
  }

  if ((count || 0) >= rule.limit) {
    return false;
  }

  await supabase.from("rate_limit_hits").insert({ ip, bucket: rule.bucket });
  return true;
}

export const RATE_LIMIT_ERROR = "Trop de requêtes envoyées depuis cette connexion. Merci de réessayer dans quelques minutes.";
