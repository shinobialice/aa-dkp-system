import { NextResponse } from "next/server";
import { authMiddleware } from "@/auth";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await authMiddleware();

  if (!session && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next|favicon.ico).*)"],
};
