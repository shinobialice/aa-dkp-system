import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  contextPromise: Promise<{ params: { token: string } }>
) {
  const { params } = await contextPromise;
  const token = await params.token;

  const result = await prisma.linkToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!result || result.used || result.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired" }, { status: 404 });
  }

  return NextResponse.json({
    username: result.user.username,
    expiresAt: result.expiresAt.toISOString(),
  });
}
