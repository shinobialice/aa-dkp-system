"use server";

import sql from "@/shared/lib/db";
import type { WeekScheduleEventRow } from "@/shared/lib/dbTypes";

type ScheduleRow = Pick<WeekScheduleEventRow, "weekday" | "time" | "boss_name">;

export async function getWeeklySchedule() {
  let data: ScheduleRow[];
  try {
    data = await sql<ScheduleRow[]>`
      SELECT weekday, time, boss_name FROM week_schedule_event
    `;
  } catch (error) {
    console.error("Ошибка получения расписания", error);
    return {};
  }

  const schedule: Record<string, [string, string][]> = {};

  for (const { weekday, time, boss_name } of data) {
    (schedule[weekday] ??= []).push([time, boss_name]);
  }

  for (const entries of Object.values(schedule)) {
    entries.sort((a, b) => a[0].localeCompare(b[0]));
  }

  return schedule;
}
