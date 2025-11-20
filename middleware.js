// middleware.js
import { NextResponse } from "next/server";

/**
 * Simple middleware guard:
 * - If requesting /dashboard or any nested path and no `token` cookie, redirect to /login
 * - If requesting /login and `token` cookie exists, redirect to /dashboard
 *
 * Note: This middleware checks for the presence of a cookie named `token`.
 * For production, prefer secure, httpOnly session cookies created & verified by your backend (Firebase Admin).
 */

export function middleware(req) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // read cookie named 'token'
  const tokenCookie = req.cookies.get("token")?.value;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!tokenCookie) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // token exists -> allow
    return NextResponse.next();
  }

  // Prevent logged-in users from seeing /login
  if (pathname === "/login") {
    if (tokenCookie) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // For all other paths, continue
  return NextResponse.next();
}

// Apply middleware to dashboard routes and login route
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
