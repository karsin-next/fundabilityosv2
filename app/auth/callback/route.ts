import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * OAuth and Email Magic Link callback handler.
 * Supabase redirects here after email confirmation or OAuth.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth error
  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError && session) {
      const user = session.user;
      
      // Use Service Role client to bypass RLS during profile creation/sync
      // This ensures new Social Auth users are ALWAYS correctly registered
      const supabaseAdmin = createServiceClient();
      
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();
        
      if (!profile) {
        // Use type-casting to ensure build passes regardless of complex circular DB types
        await (supabaseAdmin.from("profiles") as any).insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          company_name: user.user_metadata?.company_name || "",
          role: "startup"
        });
      }

      return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(exchangeError?.message || "Session failed")}`
    );
  }

  // No code — bounce to login
  return NextResponse.redirect(`${origin}/auth/login`);
}
