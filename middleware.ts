// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next(); // ничего не блокирует
}

// и можно вообще убрать config, или оставить пустой
export const config = {
  matcher: [],
};
