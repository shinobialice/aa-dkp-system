"use server";

import sql from "@/shared/lib/db";
import { getMoscowISOString } from "@/utils/getMoscowISOString";

// Время(ена) заданного босса в конкретный день недели по week_schedule_event.
// Пустой массив — в этот день недели босс не рейдится вовсе (например,
// Анталлон вне Пн/Пт/Вс).
export async function getFixedTimesForBoss(
  bossName: string,
  weekday: string,
): Promise<string[]> {
  let rows;
  try {
    rows = await sql<any[]>`
      SELECT DISTINCT time FROM week_schedule_event
      WHERE boss_name = ${bossName} AND weekday = ${weekday}
      ORDER BY time
    `;
  } catch (error) {
    console.error("Ошибка при получении расписания босса:", error);
    throw new Error("Не удалось загрузить расписание босса");
  }

  return rows.map((r) => r.time as string);
}

// Слоты АГЛ (боссу "АГЛ" конкретно, не всей категории), которые уже заняты
// созданным рейдом в этот день — чтобы не дать создать два рейда АГЛ на
// одно и то же время одной даты.
export async function getTakenAglTimesForDate(date: Date): Promise<string[]> {
  const dateOnly = getMoscowISOString(date).slice(0, 10);

  let rows;
  try {
    rows = await sql<any[]>`
      SELECT DISTINCT to_char(r.start_date, 'HH24:MI') AS time
      FROM raid r
      JOIN raid_boss rb ON rb.raid_id = r.id
      JOIN boss b ON b.id = rb.boss_id
      WHERE b.boss_name = 'АГЛ' AND r.start_date::date = ${dateOnly}::date
    `;
  } catch (error) {
    console.error("Ошибка при проверке занятых слотов АГЛ:", error);
    throw new Error("Не удалось проверить занятые слоты АГЛ");
  }

  return rows.map((r) => r.time as string);
}
