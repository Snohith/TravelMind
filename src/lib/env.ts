/**
 * Is there a real Supabase behind these env vars? The shipped `.env.example`
 * values are dummies — hitting the network with them just burns a DNS timeout
 * (fast on good networks, seconds on bad ones) before failing anyway.
 * Callers skip straight to local fallbacks when this is false.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    url.startsWith("https://") &&
    !url.includes("xyzcompany") &&
    key.length > 20 &&
    !key.includes("paste_yours_here")
  );
}
