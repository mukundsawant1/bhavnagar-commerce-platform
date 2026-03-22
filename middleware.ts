import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const isAdminRoute = pathname.startsWith("/admin");
  const isFarmRoute = pathname.startsWith("/farm");
  const isCartRoute = pathname.startsWith("/cart");
  const isCheckoutRoute = pathname.startsWith("/checkout");
  const isOrdersRoute = pathname.startsWith("/orders");

  const isProtectedRoute = isCartRoute || isCheckoutRoute || isOrdersRoute || isAdminRoute || isFarmRoute;

  if (isProtectedRoute) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL("/account?error=config", request.url));
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const sessionIsExpired = session?.expires_at
      ? session.expires_at * 1000 < Date.now()
      : true;

    if (!user || !session || sessionIsExpired || session.user?.id !== user.id) {
      const nextPath = isAdminRoute ? "/admin" : isFarmRoute ? "/farm" : pathname;
      return NextResponse.redirect(new URL(`/account?next=${encodeURIComponent(nextPath)}`, request.url));
    }

    if (isAdminRoute || isFarmRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const expectedRole = isAdminRoute ? "admin" : "farm_owner";

      if (profile?.role !== expectedRole) {
        return NextResponse.redirect(new URL("/account", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/farm/:path*",
    "/cart",
    "/checkout",
    "/orders/:path*",
    "/orders",
  ],
};
