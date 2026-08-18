"use server";

import sql from "@/shared/lib/db";

export async function getWeeklySchedule() {
  let data;
  try {
    data = await sql<any[]>`
      SELECT weekday, time, boss_name FROM week_schedule_event
    `;
  } catch (error) {
    console.error("Ошибка получения расписания", error);
    return {};
  }

  // Группируем по дням недели
  const schedule: Record<string, [string, string][]> = {};

  for (const { weekday, time, boss_name } of data) {
    if (!schedule[weekday]) schedule[weekday] = [];
    schedule[weekday].push([time, boss_name]);
  }

  // Сортировка по времени
  for (const day in schedule) {
    schedule[day].sort((a, b) => a[0].localeCompare(b[0]));
  }

  return schedule;
}
