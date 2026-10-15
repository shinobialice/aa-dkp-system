"use server";

import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";
import { getMoscowYearMonth } from "@/utils/getMoscowISOString";
import { getSessionUserId } from "./getSessionUserId";
import { getUserCurrentMonthSalary } from "./getUserCurrentMonthSalary";
import { getUserLootQueue } from "./getUserLootQueue";
import { getUserMonthlyAttendance } from "./getUserMonthlyAttendance";
import { getUserPrimeStreak } from "./getUserPrimeStreak";
import { getProfileStyle } from "./profileStyle";

const QUEUE_LIMIT = 3;

type FighterRow = Pick<
  UserRow,
  "id" | "username" | "avatar_url" | "class" | "class_gear_score" | "joined_at"
>;

export type MyFighterCard = NonNullable<
  Awaited<ReturnType<typeof getMyFighterCard>>
>;

export async function getMyFighterCard() {
  const userId = await getSessionUserId();
  if (userId === null) return null;

  const { year, month } = getMoscowYearMonth(new Date());
  const [[user], style, attendance, salary, streak, queues] = await Promise.all(
    [
      sql<FighterRow[]>`
        SELECT id, username, avatar_url, class, class_gear_score, joined_at
        FROM "user"
        WHERE id = ${userId}
      `,
      getProfileStyle(userId),
      getUserMonthlyAttendance(userId, year, month),
      getUserCurrentMonthSalary(userId),
      getUserPrimeStreak(userId),
      getUserLootQueue(userId),
    ],
  );
  if (!user) return null;

  return {
    userId: user.id,
    username: user.username,
    avatarUrl: user.avatar_url,
    frameUrl: style.frameUrl,
    className: user.class,
    gearScore: user.class_gear_score,
    joinedAt: user.joined_at,
    attendance,
    salary,
    streak,
    queues: queues.slice(0, QUEUE_LIMIT).map((entry) => ({
      id: entry.id,
      itemName: entry.itemName,
      place: entry.place,
      total: entry.totalInQueue,
    })),
  };
}
