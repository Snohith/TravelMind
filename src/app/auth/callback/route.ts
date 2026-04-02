import { createClient } from "@/lib/supabase-server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // Default to homepage to prevent confusing redirects
  let redirect = requestUrl.searchParams.get("redirect") || "/dashboard";

  // SECURITY: Prevent Open Redirect attacks
  // Only allow relative paths starting with /
  if (!redirect.startsWith("/") || redirect.includes("//")) {
    redirect = "/";
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        return NextResponse.redirect(new URL("/login?error=auth-failure", request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login?error=server-error", request.url));
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirect, request.url));
}
