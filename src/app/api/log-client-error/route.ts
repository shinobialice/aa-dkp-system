import { NextRequest, NextResponse } from "next/server";

// Браузерная консоль недоступна в логах Vercel — этот роут просто
// console.error'ит присланную ошибку на сервере, чтобы её было видно
// в Runtime Logs, когда баг репродюсит кто-то не с devtools открытыми.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.message !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { message, stack, url, userAgent } = body;

  console.error(
    "[client-error]",
    JSON.stringify({
      message,
      stack: typeof stack === "string" ? stack.slice(0, 4000) : undefined,
      url: typeof url === "string" ? url : undefined,
      userAgent: typeof userAgent === "string" ? userAgent : undefined,
      time: new Date().toISOString(),
    }),
  );

  return NextResponse.json({ ok: true });
}
