"use server";

import sql from "@/shared/lib/db";
import { getSessionUserId } from "./getSessionUserId";

export async function updateLastSeen() {
  const userId = await getSessionUserId();
  if (userId === null) return;
  await sql`UPDATE "user" SET last_seen_at = now() WHERE id = ${userId}`;
}
