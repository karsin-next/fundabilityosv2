import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that require the user to be authenticated
const PROTECTED_ROUTES = ["/dashboard", "/report", "/directory", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware entirely if Supabase is not yet configured (dev without .env.local)
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  // Build a response we can mutate (for cookie refresh)
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — important to keep alive
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static, _next/image, favicon.ico
     * - public assets
     * - api routes (handled individually)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/|api/).*)",
  ],
};
