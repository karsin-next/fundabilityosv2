import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * OAuth and Email Magic Link callback handler.
 * Supabase redirects here after email confirmation or OAuth.
 * Uses a request/response-aware client to correctly handle PKCE cookie exchange.
 */
export async function GET(request: NextRequest) {
  console.log("[Auth Callback] [TOP] Request received at:", request.url);
  const { searchParams } = new URL(request.url);
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth error passed in the URL
  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (code) {
    console.log("[Auth Callback] Authentication code detected. Building request-aware Supabase client...");

    // Build the initial redirect response so we can attach cookies to it
    const finalDest = redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`;
    let response = NextResponse.redirect(`${origin}${finalDest}`);

    // Create a Supabase client that reads cookies from the REQUEST
    // and writes session cookies directly to the RESPONSE.
    // This is critical for PKCE flow — using next/headers cookies() silently
    // fails to retrieve the code verifier in a Route Handler context.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    console.log("[Auth Callback] Exchanging code for session...");
    const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("[Auth Callback] FATAL: Exchange Error:", exchangeError.message);
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(exchangeError.message)}`);
    }

    if (!exchangeError && session) {
      const user = session.user;
      
      // Resilient Profile Sync: Check if trigger created it, otherwise insert manually
      const supabaseAdmin = createServiceClient();
      let profile = null;
      let retries = 0;
      const MAX_RETRIES = 3;

      console.log(`[Auth Callback] Checking for profile for user: ${user.id}`);

      while (retries < MAX_RETRIES) {
        const { data: existingProfile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (existingProfile) {
          profile = existingProfile;
          console.log(`[Auth Callback] Profile found (Attempt ${retries + 1})`);
          break;
        }

        console.log(`[Auth Callback] Profile not found yet, waiting... (Attempt ${retries + 1})`);
        retries++;
        if (retries < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
        }
      }

      if (!profile) {
        console.log("[Auth Callback] Profile still missing after retries, attempting manual insert...");
        const { error: insertError } = await (supabaseAdmin.from("profiles") as any).insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          company_name: user.user_metadata?.company_name || "",
          role: "startup"
        });

        if (insertError) {
          console.error("[Auth Callback] FATAL: Profile Insert Error:", insertError.message);
          // If insert fails, we might have a unique constraint error (trigger finished late)
          // Re-fetch one last time
          const { data: finalCheck } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .single();
          if (finalCheck) {
            console.log("[Auth Callback] Profile confirmed after late insert/conflict.");
          } else {
             return NextResponse.redirect(`${origin}/auth/login?error=profile_creation_failed`);
          }
        } else {
          console.log("[Auth Callback] Profile created successfully via manual insert.");
        }
      }
      
      console.log("[Auth Callback] SUCCESS: Redirecting to dashboard with session cookies set.");
      // Return the pre-built `response` — it already has the session cookies attached
      return response;
    }

    console.error("[Auth Callback] ERROR: Valid session not established after exchange.");
    return NextResponse.redirect(`${origin}/auth/login?error=session_not_found`);
  }

  // No code — check if there is an error in the URL from Supabase
  if (error) {
    console.error("[Auth Callback] URL Error from Supabase:", error, errorDescription);
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(errorDescription || error)}`);
  }

  console.warn("[Auth Callback] No code or error found. Bouncing to login.");
  return NextResponse.redirect(`${origin}/auth/login`);
}
