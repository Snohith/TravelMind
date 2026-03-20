"use server";

import { createClient } from "@/lib/supabase-server";
/**
 * Registers a new session ID for the user. 
 * This invalidates all other devices the next time they check for activity.
 * 
 * Why it exists: When you log in on Computer N, we give you a unique stamp.
 * If Computer M has an old stamp, it will see the difference and log you out.
 */
export async function registerNewSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const newSessionId = crypto.randomUUID();

  const { error } = await (supabase
    .from('profiles')
    .update({ last_session_id: newSessionId } as any)
    .eq('id', user.id) as any);

  if (error) {
    console.error("Error registering new session:", error);
    return null;
  }

  return newSessionId;
}

/**
 * Checks if the current client session ID matches the one stored in the DB.
 */
export async function validateSession(clientSessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { isValid: false };

  const { data: profile, error } = await (supabase
    .from('profiles')
    .select('last_session_id')
    .eq('id', user.id)
    .single() as any);

  if (error || !profile) return { isValid: false };

  return { isValid: profile.last_session_id === clientSessionId };
}
