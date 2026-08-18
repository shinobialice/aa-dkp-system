import { NextRequest, NextResponse } from "next/server";
import sql from "@/shared/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.pathname.split("/").pop();

  if (!token) {
    return NextResponse.json({ error: "Token not provided" }, { status: 400 });
  }

  const [result] = await sql<any[]>`
    SELECT lt.*, u.username AS user_username
    FROM link_token lt
    LEFT JOIN "user" u ON u.id = lt."userId"
    WHERE lt.token = ${token}
  `;

  if (
    !result ||
    result.used ||
    new Date(result.expiresAt) < new Date()
  ) {
    return NextResponse.json({ error: "Invalid or expired" }, { status: 404 });
  }

  return NextResponse.json({
    username: result.user_username,
    expiresAt: new Date(result.expiresAt).toISOString(),
  });
}
