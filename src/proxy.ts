import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./actions/verifySessionToken";

export async function proxy(req: NextRequest) {
  const sessionToken = req.cookies.get("session_token")?.value;

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
    "/api/notify-respawn",
    "/api/notify-schedule",
  ];

  const isPublic = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (isPublic) {
    return NextResponse.next();
  }

  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifySessionToken(sessionToken);
  if (!session.valid) {
    const redirectUrl =
      session.reason === "inactive"
        ? new URL("/login-error?reason=inactive", req.url)
        : new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
