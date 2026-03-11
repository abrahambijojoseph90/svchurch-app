import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware to protect admin routes, authenticated user routes, and API endpoints.
 * Runs at the edge before the request reaches the route handler.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Protect /admin/* pages and /api/admin/* API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!token) {
      // For API routes, return 401 JSON
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // For page routes, redirect to login
      const loginUrl = new URL("/admin-login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect authenticated user routes: /write, /my-posts, /profile/edit
  if (
    pathname.startsWith("/write") ||
    pathname.startsWith("/my-posts") ||
    pathname === "/profile/edit"
  ) {
    if (!token) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protect user API routes
  if (pathname.startsWith("/api/user/")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  // Prevent browsers from MIME-sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  return response;
}

export const config = {
  matcher: [
    // Protect admin pages
    "/admin/:path*",
    // Protect admin API routes
    "/api/admin/:path*",
    // Protect authenticated user pages
    "/write/:path*",
    "/my-posts/:path*",
    "/profile/edit",
    // Protect user API routes
    "/api/user/:path*",
  ],
};
