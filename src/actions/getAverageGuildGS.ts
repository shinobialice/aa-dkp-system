"use server";
import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";

const GS_STEP = 500;

export async function getAverageGuildGS() {
  let users: Pick<UserRow, "class_gear_score">[];
  try {
    users = await sql<Pick<UserRow, "class_gear_score">[]>`
      SELECT class_gear_score FROM "user"
      WHERE active = true AND class_gear_score IS NOT NULL
        AND id NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
    `;
  } catch {
    return 0;
  }

  if (users.length === 0) return 0;

  const sum = users.reduce(
    (acc, user) => acc + (user.class_gear_score ?? 0),
    0,
  );
  return Math.floor(sum / users.length / GS_STEP) * GS_STEP;
}
