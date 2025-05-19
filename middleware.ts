import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("session_token");

  const publicPaths = [
    "/login",
    "/link-account",
    "/api/auth",
    "/favicon.ico",
    "/api/link-token",
    "/robots.txt",
    "/images",
    "/_next/static",
    "/_next/image",
    "/api/auth/vk/callback",
  ];

  const isPublic = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isPublic) return NextResponse.next();

  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
