import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Graceful fallback: If Supabase variables are not set or are placeholder templates, bypass authentication gating to keep the app functional in demo mode.
  const isConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your-supabase-anon-key";

  if (!isConfigured) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Retrieve user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // Gating rules:
  // 1. If not logged in and requesting a protected route, redirect to /login
  if (!user && !url.pathname.startsWith("/login") && !url.pathname.startsWith("/signup")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. If already logged in and requesting auth routes, redirect to /dashboard
  if (user && (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup"))) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
