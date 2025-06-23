"use server";
import supabase from "@/lib/supabase";
import ensurePrivilieges from "./ensurePrivilieges";

function getMoscowISOString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

const createRaidEvent = async (
  type: string,
  dkp_summary: number,
  start_date: Date,
  userIds: number[],
  bossIds: number[],
  is_pvp: boolean,
  is_pvp_long: boolean
) => {
  await ensurePrivilieges(["Администратор", "Модератор"]);

  // 1. Получить текущее количество активных пользователей
  const { data: activeUsers, error: activeError } = await supabase
    .from("user")
    .select("id")
    .eq("active", true);

  if (activeError || !activeUsers) {
    console.error("Failed to fetch active users:", activeError);
    throw new Error("Ошибка при определении активного состава");
  }

  const active_user_count = activeUsers.length;

  // 2. Создать рейд с этим числом
  const { data: raid, error: raidError } = await supabase
    .from("raid")
    .insert([
      {
        type,
        dkp_summary,
        start_date: getMoscowISOString(start_date),
        created_at: new Date().toISOString(),
        is_pvp,
        is_pvp_long,
        active_user_count,
      },
    ])
    .select()
    .maybeSingle();

  if (raidError || !raid) {
    console.error("Failed to create raid:", raidError);
    throw new Error("Ошибка при создании рейда");
  }

  // 3. Участники
  const attendanceData = userIds.map((user_id) => ({
    raid_id: raid.id,
    user_id,
    created_at: new Date().toISOString(),
  }));

  const { error: attendanceError } = await supabase
    .from("raid_attendance")
    .insert(attendanceData);

  if (attendanceError) {
    console.error("Failed to insert raid attendance:", attendanceError);
    throw new Error("Ошибка при добавлении участников");
  }

  // 4. Боссы
  const bossData = bossIds.map((boss_id) => ({
    raid_id: raid.id,
    boss_id,
  }));

  const { error: bossError } = await supabase
    .from("raid_boss")
    .insert(bossData);

  if (bossError) {
    console.error("Failed to insert raid bosses:", bossError);
    throw new Error("Ошибка при добавлении боссов");
  }

  return raid;
};

export default createRaidEvent;
