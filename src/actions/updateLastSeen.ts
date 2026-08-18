"use server";

import sql from "@/shared/lib/db";

export async function updateLastSeen(userId: number) {
  await sql<any[]>`
    UPDATE "user" SET last_seen_at = now() WHERE id = ${userId}
  `;
}
