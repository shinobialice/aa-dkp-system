"use server";

import { cookies } from "next/headers";
import sql from "@/shared/lib/db";

export async function getSessionUserId(): Promise<number | null> {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  if (!sessionToken) return null;

  const [user] = await sql<any[]>`
    SELECT id FROM "user" WHERE session_token = ${sessionToken}
  `;

  return user?.id ?? null;
}
