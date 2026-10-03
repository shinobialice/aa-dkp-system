"use server";

import sql from "@/shared/lib/db";
import {
  computeMissingActivities,
  type MissingActivities,
  type MonthRaid,
  type OverrideRow,
  type ScheduleRow,
} from "@/server/missingActivities";
import { getMoscowISOString } from "@/utils/getMoscowISOString";

export type {
  MissingActivities,
  MissingSlot,
} from "@/server/missingActivities";

const NO_DEFICIT: MissingActivities = { hasDeficit: false, missingSlots: [] };

export const getMissingActivitiesForMonth = async (
  targetYear?: number,
  targetMonth?: number,
): Promise<MissingActivities> => {
  const today = getMoscowISOString(new Date()).slice(0, 10);
  const [currentYear, currentMonth, currentDay] = today.split("-").map(Number);

  const year = targetYear ?? currentYear;
  const month = targetMonth ?? currentMonth;
  const monthKey = year * 12 + month;
  const currentMonthKey = currentYear * 12 + currentMonth;

  if (monthKey > currentMonthKey) return NO_DEFICIT;

  const lastDay =
    monthKey === currentMonthKey
      ? currentDay
      : new Date(Date.UTC(year, month, 0)).getUTCDate();
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
  const monthStart = `${monthPrefix}-01`;
  const monthEnd = `${monthPrefix}-${String(lastDay).padStart(2, "0")}`;

  try {
    const [raids, schedule, morphKills, overrides] = await Promise.all([
      sql<MonthRaid[]>`
        SELECT
          to_char(r.start_date, 'YYYY-MM-DD"T"HH24:MI') AS start,
          r.type,
          COALESCE(
            (
              SELECT array_agg(b.boss_name)
              FROM raid_boss rb
              JOIN boss b ON b.id = rb.boss_id
              WHERE rb.raid_id = r.id
            ),
            '{}'
          ) AS bosses
        FROM raid r
        WHERE r.start_date >= ${monthStart}::date
          AND r.start_date < ${monthEnd}::date + 1
      `,
      sql<ScheduleRow[]>`
        SELECT weekday, time, boss_name FROM week_schedule_event
      `,
      sql<{ kill_time: string }[]>`
        SELECT kill_time FROM boss_kill_raid_suggestions
        WHERE boss_name = 'Морф' AND status = 'pending'
      `,
      sql<OverrideRow[]>`
        SELECT id, activity_date, time, boss_name, kind FROM missing_activity_overrides
        WHERE activity_date BETWEEN ${monthStart} AND ${monthEnd}
      `,
    ]);

    return computeMissingActivities({
      year,
      month,
      lastDay,
      raids,
      schedule,
      morphKillTimes: morphKills.map((row) => row.kill_time),
      overrides,
    });
  } catch (error) {
    console.error(
      "Ошибка при получении данных для проверки расписания:",
      error,
    );
    throw new Error("Не удалось загрузить рейды");
  }
};
