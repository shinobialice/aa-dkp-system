"use server";

import supabase from "@/lib/supabase";
import ensurePrivilieges from "./ensurePrivilieges";

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
  is_pvp_long: boolean
) => {
  await ensurePrivilieges(["Администратор", "Модератор"]);
  // 1. Update the raid event itself
  const { error: updateError } = await supabase
    .from("raid")
    .update({
      type,
      dkp_summary,
      start_date: start_date.toISOString(),
      is_pvp,
      is_pvp_long,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Ошибка при обновлении события:", updateError);
    throw new Error("Не удалось обновить событие");
  }

  // 2. Delete old attendance and raid bosses
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

  // 3. Insert new attendance entries
  if (userIds.length > 0) {
    const attendanceInsert = userIds.map((user_id) => ({
      raid_id: id,
      user_id,
      created_at: new Date().toISOString(),
    }));

    const { error: attendanceInsertError } = await supabase
      .from("raid_attendance")
      .insert(attendanceInsert);

    if (attendanceInsertError) {
      throw new Error("Не удалось добавить участников рейда");
    }
  }

  // 4. Insert new raid bosses
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
};

export default updateEvent;
