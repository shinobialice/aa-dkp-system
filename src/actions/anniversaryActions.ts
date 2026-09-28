"use server";

import sql from "@/shared/lib/db";
import { getMoscowISOString } from "@/utils/getMoscowISOString";
import { getSessionUserId } from "./getSessionUserId";

export type Anniversary = {
  userId: number;
  username: string;
  avatarUrl: string | null;
  years: number;
  cheeredBy: { id: number; username: string }[];
};

export type TodayAnniversaries = {
  date: string;
  viewerId: number | null;
  anniversaries: Anniversary[];
};

type AnniversaryRow = {
  id: number;
  username: string;
  avatar_url: string | null;
  years: number;
};

async function selectTodayAnniversaries(userId: number | null = null) {
  return sql<AnniversaryRow[]>`
    WITH today AS (
      SELECT (now() AT TIME ZONE 'Europe/Moscow')::date AS d
    ),
    members AS (
      SELECT u.id, u.username, u.avatar_url,
             ((u.joined_at AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Moscow')::date AS joined
      FROM "user" u
      WHERE u.active = true
        AND u.joined_at IS NOT NULL
        AND (${userId}::int IS NULL OR u.id = ${userId}::int)
    )
    SELECT m.id, m.username, m.avatar_url,
           (EXTRACT(YEAR FROM t.d) - EXTRACT(YEAR FROM m.joined))::int AS years
    FROM members m
    CROSS JOIN today t
    WHERE m.joined < t.d
      AND m.joined + make_interval(years => (EXTRACT(YEAR FROM t.d) - EXTRACT(YEAR FROM m.joined))::int) = t.d
    ORDER BY years DESC, m.username ASC
  `;
}

export async function getTodayAnniversaries(): Promise<TodayAnniversaries> {
  const date = getMoscowISOString(new Date()).slice(0, 10);
  const viewerId = await getSessionUserId();
  if (!viewerId) return { date, viewerId, anniversaries: [] };

  try {
    const rows = await selectTodayAnniversaries();
    if (rows.length === 0) return { date, viewerId, anniversaries: [] };

    const cheers = await sql<
      { user_id: number; years: number; cheered_by: number; username: string }[]
    >`
      SELECT c.user_id, c.years, c.cheered_by, u.username
      FROM anniversary_cheers c
      JOIN "user" u ON u.id = c.cheered_by
      WHERE c.user_id = ANY(${rows.map((r) => r.id)})
      ORDER BY c.created_at ASC
    `;

    return {
      date,
      viewerId,
      anniversaries: rows.map((r) => ({
        userId: r.id,
        username: r.username,
        avatarUrl: r.avatar_url,
        years: r.years,
        cheeredBy: cheers
          .filter((c) => c.user_id === r.id && c.years === r.years)
          .map((c) => ({ id: c.cheered_by, username: c.username })),
      })),
    };
  } catch (error) {
    console.error("Ошибка при получении юбилеев:", error);
    return { date, viewerId, anniversaries: [] };
  }
}

export async function cheerAnniversary(
  userId: number,
): Promise<TodayAnniversaries> {
  const viewerId = await getSessionUserId();
  if (!viewerId) throw new Error("Нужно войти в аккаунт");

  if (viewerId !== userId) {
    const [row] = await selectTodayAnniversaries(userId);
    if (!row) throw new Error("Сегодня у игрока нет юбилея");

    await sql`
      INSERT INTO anniversary_cheers (user_id, years, cheered_by)
      VALUES (${userId}, ${row.years}, ${viewerId})
      ON CONFLICT DO NOTHING
    `;
  }

  return getTodayAnniversaries();
}
