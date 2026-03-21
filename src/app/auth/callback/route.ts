import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // Default to homepage to prevent confusing redirects
  let redirect = requestUrl.searchParams.get("redirect") || "/dashboard";

  // SECURITY: Prevent Open Redirect attacks
  // Only allow relative paths starting with /
  if (!redirect.startsWith("/") || redirect.includes("//")) {
    console.warn("[SECURITY] Blocked potentially malicious redirect:", redirect);
    redirect = "/";
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("[SECURITY] Auth code exchange failed:", error.message);
        return NextResponse.redirect(new URL("/login?error=auth-failure", request.url));
      }
    } catch (err) {
      console.error("[SECURITY] Unexpected error during code exchange:", err);
      return NextResponse.redirect(new URL("/login?error=server-error", request.url));
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirect, request.url));
}
