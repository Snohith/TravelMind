import { createClient } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/env";

/**
 * Who owns this request's trips. No sign-in yet (see ADR-0004), so
 * there's no session to read most of the time — everyone shares one demo
 * bucket instead of getting bounced to a login page that no longer exists.
 *
 * When sign-in comes back, this is the only function that needs to change:
 * return the session user id first, keep the demo fallback for logged-out
 * browsing or delete it outright.
 */
export async function resolveOwnerId(): Promise<string> {
  // Fail fast: with example keys the session lookup is a guaranteed network
  // timeout, so don't pay it on every single action.
  if (!isSupabaseConfigured()) return "local-demo";
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return user.id;
  } catch {
    // Keys set but unreachable — demo mode.
  }
  return "local-demo";
}
