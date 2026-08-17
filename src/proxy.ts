import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./actions/verifySessionToken";

// proxy запускается на каждый запрос без исключений (нет config.matcher) —
// это не только навигация, но и каждый server action по отдельности
// (Promise.all из нескольких getX() на одной странице — это столько же
// отдельных проверок сессии). Без кэша это била в Supabase лишний раз на
// каждый чих. Кэшируем результат на несколько секунд: в пределах одного
// тёплого инстанса схлопывает пачку повторных проверок в одну; бан/
// деактивация применится не позже, чем истечёт TTL — не мгновенно, но и не
// критично для гильдейского DKP-инструмента. Инстансов у Vercel несколько и
// кэш между ними не общий — это best-effort снижение нагрузки, а не строгая
// гарантия "не больше одной проверки раз в TTL".
const SESSION_CACHE_TTL_MS = 20_000;
type CachedSession = {
  result: Awaited<ReturnType<typeof verifySessionToken>>;
  expiresAt: number;
};
const sessionCache = new Map<string, CachedSession>();

async function verifySessionCached(token: string) {
  const cached = sessionCache.get(token);
  if (cached && cached.expiresAt > Date.now()) return cached.result;

  const result = await verifySessionToken(token);
  // Подстраховка от бесконтрольного роста при активной ротации токенов
  // (перелогины во время тестов и т.п.) — в норме тут максимум пара
  // десятков одновременных сессий гильдии.
  if (sessionCache.size > 1000) sessionCache.clear();
  sessionCache.set(token, { result, expiresAt: Date.now() + SESSION_CACHE_TTL_MS });
  return result;
}

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

  const session = await verifySessionCached(sessionToken);
  if (!session.valid) {
    const redirectUrl =
      session.reason === "inactive"
        ? new URL("/login-error?reason=inactive", req.url)
        : new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
