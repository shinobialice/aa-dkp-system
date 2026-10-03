import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";
import { getSessionUser } from "@/shared/lib/session";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sessionUser = await getSessionUser(token);

  if (!sessionUser || !sessionUser.active) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const [user] = await sql<Pick<UserRow, "id" | "username" | "avatar_url">[]>`
    SELECT id, username, avatar_url FROM "user" WHERE id = ${sessionUser.id}
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
