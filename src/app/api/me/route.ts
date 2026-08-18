import sql from "@/shared/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [user] = await sql<any[]>`
    SELECT id, username, avatar_url FROM "user" WHERE session_token = ${token}
  `;

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json(
    {
      id: user.id,
      name: user.username,
      avatar:
        user.avatar_url ??
        `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`,
    },
    { status: 200 },
  );
}
