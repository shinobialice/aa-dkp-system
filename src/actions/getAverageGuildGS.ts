"use server";
import sql from "@/shared/lib/db";

export async function getAverageGuildGS() {
  let users;
  try {
    users = await sql<any[]>`
      SELECT class_gear_score FROM "user"
      WHERE active = true AND class_gear_score IS NOT NULL
    `;
  } catch {
    return 0;
  }

  if (!users || users.length === 0) {
    return 0;
  }

  const sum = users.reduce((acc, u) => acc + (u.class_gear_score ?? 0), 0);
  const avg = sum / users.length;

  return Math.floor(avg / 500) * 500;
}
