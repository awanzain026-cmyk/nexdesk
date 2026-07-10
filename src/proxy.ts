import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = ["/dashboard", "/tickets", "/products", "/analytics", "/settings"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));

  if (!isProtected) {
    return NextResponse.next();
  }

  const redirectToLogin = () => {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(redirectUrl);
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("[proxy] Supabase env vars missing -- failing safe to /login instead of crashing");
    return redirectToLogin();
  }

  try {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return redirectToLogin();
    }

    return response;
  } catch (err) {
    console.error("[proxy] Unexpected error checking auth -- failing safe to /login:", err);
    return redirectToLogin();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/tickets/:path*", "/products/:path*", "/analytics/:path*", "/settings/:path*"],
};
