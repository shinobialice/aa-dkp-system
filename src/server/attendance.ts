import "server-only";
import sql from "@/shared/lib/db";
import type { RaidAttendanceRow, RaidRow } from "@/shared/lib/dbTypes";

export type MonthlyAttendance = {
  primePercent: number;
  aglPercent: number;
  totalPercent: number;
  dkp: number;
  totalPointsAvailable: number;
};

export type AttendedRaid = Pick<RaidRow, "type" | "dkp_summary"> & {
  is_late: RaidAttendanceRow["is_late"] | null;
};

type MonthRaidRow = Pick<RaidRow, "id" | "type" | "dkp_summary"> & {
  start_date: string;
  user_id: number | null;
  is_late: boolean | null;
};

const LATE_WEIGHT = 0.5;

export function summarizeAttendance(raids: AttendedRaid[]): MonthlyAttendance {
  const totals = { prime: 0, agl: 0, points: 0 };
  const earned = { prime: 0, agl: 0, points: 0 };

  for (const raid of raids) {
    const dkp = raid.dkp_summary ?? 0;
    const weight = attendanceWeight(raid.is_late);

    if (raid.type === "Прайм") {
      totals.prime += 1;
      earned.prime += weight;
    } else if (raid.type === "АГЛ") {
      totals.agl += 1;
      earned.agl += weight;
    }

    totals.points += dkp;
    earned.points += dkp * weight;
  }

  return {
    aglPercent: percent(earned.agl, totals.agl),
    primePercent: percent(earned.prime, totals.prime),
    totalPercent: percent(earned.points, totals.points),
    dkp: earned.points,
    totalPointsAvailable: totals.points,
  };
}

export async function computeMonthlyAttendanceForUsers(
  users: { id: number; joined_at: string | null }[],
  month: number,
  year: number,
): Promise<Record<number, MonthlyAttendance>> {
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1)).toISOString();

  let rows: MonthRaidRow[];
  try {
    rows = await sql<MonthRaidRow[]>`
      SELECT r.id, r.type, r.start_date, r.dkp_summary, ra.user_id, ra.is_late
      FROM raid r
      LEFT JOIN raid_attendance ra ON ra.raid_id = r.id
      WHERE r.start_date >= ${monthStart.toISOString()} AND r.start_date < ${endDate}
    `;
  } catch (raidsError) {
    console.error("Ошибка при получении рейдов:", raidsError);
    throw new Error("Не удалось получить рейды");
  }

  const raids = groupRaids(rows);

  return Object.fromEntries(
    users.map((user) => {
      const joinedAt = user.joined_at ? new Date(user.joined_at) : null;
      const effectiveStart =
        joinedAt && joinedAt > monthStart ? joinedAt : monthStart;
      const attended = raids
        .filter((raid) => new Date(raid.startDate) >= effectiveStart)
        .map((raid) => ({
          type: raid.type,
          dkp_summary: raid.dkp_summary,
          is_late: raid.lateByUser.get(user.id) ?? null,
        }));
      return [user.id, summarizeAttendance(attended)];
    }),
  );
}

function groupRaids(rows: MonthRaidRow[]) {
  const raids = new Map<
    number,
    Pick<RaidRow, "type" | "dkp_summary"> & {
      startDate: string;
      lateByUser: Map<number, boolean>;
    }
  >();
  for (const row of rows) {
    const raid = raids.get(row.id) ?? {
      type: row.type,
      dkp_summary: row.dkp_summary,
      startDate: row.start_date,
      lateByUser: new Map<number, boolean>(),
    };
    if (row.user_id !== null) raid.lateByUser.set(row.user_id, !!row.is_late);
    raids.set(row.id, raid);
  }
  return [...raids.values()];
}

function attendanceWeight(isLate: boolean | null) {
  if (isLate === null) return 0;
  return isLate ? LATE_WEIGHT : 1;
}

function percent(part: number, total: number) {
  return total ? (part / total) * 100 : 0;
}
