import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("session_token");

  // пути, которые не требуют авторизации
  const publicPaths = [
    "/login",
    "/link-account",
    "/api/auth",
    "/favicon.ico",
    "/api/link-token",
    "/robots.txt",
    "/images",
  ];

  const isPublic = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // если публичная страница — пропускаем
  if (isPublic) return NextResponse.next();

  // если неавторизован — редиректим на login
  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
