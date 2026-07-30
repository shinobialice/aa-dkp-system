"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import { triggerFinanceRecalc } from "./recalculateFinanceForMonth";

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
  // Запоминаем старую дату — если рейд переносят в другой месяц, пересчитать
  // нужно оба месяца (у старого пропадает посещаемость/dkp, у нового — появляется).
  const { data: previousRaid } = await supabase
    .from("raid")
    .select("start_date")
    .eq("id", id)
    .maybeSingle();

  const { error: updateError } = await supabase
    .from("raid")
    .update({
      type,
      dkp_summary,
      start_date: start_date.toISOString(),
      is_pvp,
      is_pvp_long,
      is_proc,
      is_double_proc,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Ошибка при обновлении события:", updateError);
    throw new Error("Не удалось обновить событие");
  }

  const { error: attendanceDeleteError } = await supabase
    .from("raid_attendance")
    .delete()
    .eq("raid_id", id);

  const { error: raidBossDeleteError } = await supabase
    .from("raid_boss")
    .delete()
    .eq("raid_id", id);

  if (attendanceDeleteError || raidBossDeleteError) {
    throw new Error("Не удалось очистить старые связи рейда");
  }

  if (userIds.length > 0) {
    const attendanceInsert = userIds.map((user_id) => ({
      raid_id: id,
      user_id,
      created_at: new Date().toISOString(),
      is_late: lateUserIds.includes(user_id),
    }));

    const { error: attendanceInsertError } = await supabase
      .from("raid_attendance")
      .insert(attendanceInsert);

    if (attendanceInsertError) {
      throw new Error("Не удалось добавить участников рейда");
    }
  }

  if (bossIds.length > 0) {
    const raidBossInsert = bossIds.map((boss_id) => ({
      raid_id: id,
      boss_id,
    }));

    const { error: bossInsertError } = await supabase
      .from("raid_boss")
      .insert(raidBossInsert);

    if (bossInsertError) {
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
