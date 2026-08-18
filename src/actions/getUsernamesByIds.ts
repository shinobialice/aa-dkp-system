"use server";

import sql from "@/shared/lib/db";

export const getUsernamesByIds = async (
  userIds: number[],
): Promise<Record<number, string>> => {
  if (userIds.length === 0) return {};

  try {
    const data = await sql<any[]>`
      SELECT id, username FROM "user" WHERE id = ANY(${userIds})
    `;

    const result: Record<number, string> = {};
    data.forEach((u) => {
      result[u.id] = u.username;
    });
    return result;
  } catch {
    return {};
  }
};
