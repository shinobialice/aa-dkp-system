"use server";

import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";
import { getMoscowYearMonth } from "@/utils/getMoscowISOString";
import { getProfileStyle } from "./profileStyle";
import { getUserMonthlyAttendance } from "./getUserMonthlyAttendance";

type CardRow = Pick<
  UserRow,
  | "id"
  | "username"
  | "avatar_url"
  | "class"
  | "class_gear_score"
  | "joined_at"
  | "active"
>;

export type PlayerCard = Awaited<ReturnType<typeof getPlayerCard>>;

export async function getPlayerCard(userId: number) {
  const [user] = await sql<CardRow[]>`
    SELECT id, username, avatar_url, class, class_gear_score, joined_at, active
    FROM "user"
    WHERE id = ${userId}
  `;
  if (!user) throw new Error("Игрок не найден");

  const { year, month } = getMoscowYearMonth(new Date());
  const [style, attendance] = await Promise.all([
    getProfileStyle(userId),
    getUserMonthlyAttendance(userId, year, month),
  ]);

  return { ...user, style, attendancePercent: attendance.totalPercent };
}
