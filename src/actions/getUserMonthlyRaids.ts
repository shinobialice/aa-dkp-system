"use server";
import sql from "@/shared/lib/db";

export type UserMonthlyRaid = {
  id: number;
  type: string | null;
  startDate: string | null;
  dkpSummary: number;
  isLate: boolean;
  bosses: string[];
};

export async function getUserMonthlyRaids(
  userId: number,
  year: number,
  month: number,
): Promise<UserMonthlyRaid[]> {
  const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
  const endDate = new Date(
    Date.UTC(month === 12 ? year + 1 : year, month % 12, 1),
  ).toISOString();

  let raids;
  try {
    raids = await sql<any[]>`
      SELECT id, type, start_date, dkp_summary
      FROM raid
      WHERE start_date >= ${startDate} AND start_date < ${endDate}
      ORDER BY start_date DESC
    `;
  } catch (error) {
    console.error("Ошибка при получении рейдов пользователя:", error);
    throw new Error("Не удалось загрузить рейды пользователя");
  }

  const raidIds = raids.map((r) => r.id);
  let attendanceRows: any[] = [];
  let bossRows: any[] = [];
  if (raidIds.length > 0) {
    [attendanceRows, bossRows] = await Promise.all([
      sql<any[]>`SELECT raid_id, user_id, is_late FROM raid_attendance WHERE raid_id = ANY(${raidIds})`,
      sql<any[]>`
        SELECT rb.raid_id, b.boss_name
        FROM raid_boss rb
        JOIN boss b ON b.id = rb.boss_id
        WHERE rb.raid_id = ANY(${raidIds})
      `,
    ]);
  }

  const attendanceByRaid = new Map<number, { user_id: number; is_late: boolean }[]>();
  for (const a of attendanceRows) {
    if (!attendanceByRaid.has(a.raid_id)) attendanceByRaid.set(a.raid_id, []);
    attendanceByRaid.get(a.raid_id)!.push(a);
  }
  const bossesByRaid = new Map<number, string[]>();
  for (const b of bossRows) {
    if (!bossesByRaid.has(b.raid_id)) bossesByRaid.set(b.raid_id, []);
    bossesByRaid.get(b.raid_id)!.push(b.boss_name);
  }

  return raids
    .filter((raid) =>
      (attendanceByRaid.get(raid.id) ?? []).some((a) => a.user_id === userId),
    )
    .map((raid) => ({
      id: raid.id,
      type: raid.type,
      startDate: raid.start_date,
      dkpSummary: raid.dkp_summary ?? 0,
      isLate:
        (attendanceByRaid.get(raid.id) ?? []).find((a) => a.user_id === userId)
          ?.is_late ?? false,
      bosses: bossesByRaid.get(raid.id) ?? [],
    }));
}
