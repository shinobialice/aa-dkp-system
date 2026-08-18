"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { triggerFinanceRecalc } from "./recalculateFinanceForMonth";
import { getMoscowISOString } from "@/utils/getMoscowISOString";

/**
 * Обновляет существующее событие по ID
 */
const updateEvent = async (
  id: number,
  type: string,
  dkp_summary: number,
  start_date: Date,
  userIds: number[],
  bossIds: number[],
  is_pvp: boolean,
  is_pvp_long: boolean,
  is_proc: boolean = false,
  is_double_proc: boolean = false,
  lateUserIds: number[] = [],
) => {
  await ensurePrivilieges([
    "Администратор",
    "Raid Manager",
    "Модератор",
    "Секретутка",
  ]);

  // Запоминаем старую дату — если рейд переносят в другой месяц, пересчитать
  // нужно оба месяца (у старого пропадает посещаемость/dkp, у нового — появляется).
  const [previousRaid] = await sql<any[]>`
    SELECT start_date FROM raid WHERE id = ${id}
  `;

  try {
    await sql<any[]>`
      UPDATE raid SET
        type = ${type},
        dkp_summary = ${dkp_summary},
        start_date = ${getMoscowISOString(start_date)},
        is_pvp = ${is_pvp},
        is_pvp_long = ${is_pvp_long},
        is_proc = ${is_proc},
        is_double_proc = ${is_double_proc}
      WHERE id = ${id}
    `;
  } catch (updateError) {
    console.error("Ошибка при обновлении события:", updateError);
    throw new Error("Не удалось обновить событие");
  }

  try {
    await sql<any[]>`DELETE FROM raid_attendance WHERE raid_id = ${id}`;
    await sql<any[]>`DELETE FROM raid_boss WHERE raid_id = ${id}`;
  } catch {
    throw new Error("Не удалось очистить старые связи рейда");
  }

  if (userIds.length > 0) {
    const attendanceInsert = userIds.map((user_id) => ({
      raid_id: id,
      user_id,
      created_at: new Date().toISOString(),
      is_late: lateUserIds.includes(user_id),
    }));

    try {
      await sql<any[]>`INSERT INTO raid_attendance ${sql(attendanceInsert)}`;
    } catch {
      throw new Error("Не удалось добавить участников рейда");
    }
  }

  if (bossIds.length > 0) {
    const raidBossInsert = bossIds.map((boss_id) => ({
      raid_id: id,
      boss_id,
    }));

    try {
      await sql<any[]>`INSERT INTO raid_boss ${sql(raidBossInsert)}`;
    } catch {
      throw new Error("Не удалось добавить боссов к рейду");
    }
  }

  // Посещаемость/dkp влияют на веса зарплат за месяц рейда — пересчитываем
  // сразу, не дожидаясь таймера на /loot/finance.
  const monthsToRecalc = new Set([
    `${start_date.getFullYear()}-${start_date.getMonth() + 1}`,
  ]);
  if (previousRaid?.start_date) {
    const prevDate = new Date(previousRaid.start_date);
    monthsToRecalc.add(`${prevDate.getFullYear()}-${prevDate.getMonth() + 1}`);
  }

  for (const key of monthsToRecalc) {
    const [year, month] = key.split("-").map(Number);
    await triggerFinanceRecalc(month, year);
  }
};

export default updateEvent;
