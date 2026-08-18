"use server";

import sql from "@/shared/lib/db";

export type DailyRaidStat = {
  id: number;
  start_date: string;
  type: string;
  bosses: string[];
  attendeeCount: number;
  activeUserCount: number | null;
};

function nextDayString(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  const yy = next.getUTCFullYear();
  const mm = String(next.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(next.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

// date — "YYYY-MM-DD". raid.start_date хранится как naive-строка без
// таймзоны (по факту московское время), поэтому границы дня строим так же,
// наивно, без прогона через toISOString().
export async function getRaidsByDay(date: string): Promise<DailyRaidStat[]> {
  const dayStart = `${date}T00:00:00`;
  const dayEnd = `${nextDayString(date)}T00:00:00`;

  let raidRows;
  try {
    raidRows = await sql<any[]>`
      SELECT id, start_date, type, active_user_count
      FROM raid
      WHERE start_date >= ${dayStart} AND start_date < ${dayEnd}
      ORDER BY start_date ASC
    `;
  } catch (error) {
    console.error("Ошибка при получении рейдов за день:", error);
    throw new Error("Не удалось загрузить рейды за день");
  }

  const raidIds = raidRows.map((r) => r.id);
  let bossRows: any[] = [];
  let attendanceRows: any[] = [];
  if (raidIds.length > 0) {
    [bossRows, attendanceRows] = await Promise.all([
      sql<any[]>`
        SELECT rb.raid_id, b.boss_name
        FROM raid_boss rb
        JOIN boss b ON b.id = rb.boss_id
        WHERE rb.raid_id = ANY(${raidIds})
      `,
      sql<any[]>`SELECT raid_id FROM raid_attendance WHERE raid_id = ANY(${raidIds})`,
    ]);
  }

  const bossesByRaid = new Map<number, string[]>();
  for (const b of bossRows) {
    if (!bossesByRaid.has(b.raid_id)) bossesByRaid.set(b.raid_id, []);
    bossesByRaid.get(b.raid_id)!.push(b.boss_name);
  }
  const attendeeCountByRaid = new Map<number, number>();
  for (const a of attendanceRows) {
    attendeeCountByRaid.set(a.raid_id, (attendeeCountByRaid.get(a.raid_id) ?? 0) + 1);
  }

  return raidRows.map((raid) => ({
    id: raid.id,
    start_date: raid.start_date,
    type: raid.type,
    bosses: bossesByRaid.get(raid.id) ?? [],
    attendeeCount: attendeeCountByRaid.get(raid.id) ?? 0,
    activeUserCount: raid.active_user_count,
  }));
}
