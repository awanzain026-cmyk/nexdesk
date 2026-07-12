import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// These routes require admin login
const ADMIN_PATHS = [
  "/dashboard", "/tickets", "/products", "/analytics", "/settings",
]

// /chat is admin-only (internal agent chat)
// /support is public (customer-facing chat)
export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const isAdminPath = ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  // Block admin routes if not logged in
  if (isAdminPath && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logged-in admin away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap|robots|privacy|terms|support).*)",
  ],
}
