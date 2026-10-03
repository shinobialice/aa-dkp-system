"use server";

import type { GuildMode } from "@/shared/config/guildStatus";
import sql from "@/shared/lib/db";
import type { RaidAttendanceRow, UserRow } from "@/shared/lib/dbTypes";

export type PeriodAttendanceEntry = {
  userId: number;
  username: string;
  avatarUrl: string | null;
  userClass: string | null;
  raidsAttended: number;
};

export type PeriodAttendanceResult = {
  top: PeriodAttendanceEntry[];
  participantsCount: number;
  totalRaidsInPeriod: number;
};

type AttendanceQueryRow = {
  id: number;
  user_id: RaidAttendanceRow["user_id"] | null;
  is_late: boolean | null;
  username: UserRow["username"] | null;
  avatar_url: UserRow["avatar_url"];
  class: UserRow["class"];
};

const LATE_WEIGHT = 0.5;

export async function getPeriodAttendanceTop(
  startedAt: string,
  endedAt: string | null,
  mode: GuildMode,
  limit?: number,
): Promise<PeriodAttendanceResult> {
  let rows: AttendanceQueryRow[];
  try {
    rows = await sql<AttendanceQueryRow[]>`
      SELECT r.id, ra.user_id, ra.is_late, u.username, u.avatar_url, u.class
      FROM raid r
      LEFT JOIN raid_attendance ra ON ra.raid_id = r.id
      LEFT JOIN "user" u ON u.id = ra.user_id
      WHERE r.start_date >= ${startedAt}
        ${endedAt ? sql`AND r.start_date < ${endedAt}` : sql``}
        ${mode === "pvp" ? pvpRaidsOnly() : sql``}
    `;
  } catch (error) {
    console.error("Ошибка при получении посещаемости за период:", error);
    throw new Error("Не удалось получить посещаемость за период");
  }

  const raidIds = new Set<number>();
  const byUser = new Map<number, PeriodAttendanceEntry>();
  for (const row of rows) {
    raidIds.add(row.id);
    if (row.user_id === null) continue;
    const entry = byUser.get(row.user_id) ?? {
      userId: row.user_id,
      username: row.username ?? "?",
      avatarUrl: row.avatar_url,
      userClass: row.class,
      raidsAttended: 0,
    };
    entry.raidsAttended += row.is_late ? LATE_WEIGHT : 1;
    byUser.set(row.user_id, entry);
  }

  const sorted = [...byUser.values()].sort(
    (a, b) => b.raidsAttended - a.raidsAttended,
  );
  return {
    top: limit ? sorted.slice(0, limit) : sorted,
    participantsCount: byUser.size,
    totalRaidsInPeriod: raidIds.size,
  };
}

// В режиме "пвп" считаем только рейды, где реально было ПВП — отмечается
// галочкой "ПВП" при создании рейда (attendance_bonus_types.label = 'ПВП',
// привязка в raid_bonus), а не любой рейд, попавший в варный период по дате.
// На фришке такого разделения нет — считаем все рейды периода.
function pvpRaidsOnly() {
  return sql`
    AND EXISTS (
      SELECT 1 FROM raid_bonus rb
      JOIN attendance_bonus_types bt ON bt.id = rb.bonus_type_id
      WHERE rb.raid_id = r.id AND bt.label = 'ПВП'
    )
  `;
}
