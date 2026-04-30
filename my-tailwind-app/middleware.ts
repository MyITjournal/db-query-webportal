import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/profiles", "/search", "/account"];
const AUTH_ONLY = ["/login"]; // redirect to dashboard if already authed
const COOKIE_NAME = "insighta_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(COOKIE_NAME);

  if (PROTECTED.some((r) => pathname.startsWith(r))) {
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (AUTH_ONLY.some((r) => pathname === r || pathname.startsWith(r))) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/profiles/:path*",
    "/search/:path*",
    "/account/:path*",
  ],
};
