"use server";
import supabase from "@/lib/supabase";

const createRaidEvent = async (
  type: string,
  dkp_summary: number,
  start_date: Date,
  userIds: number[],
  bossIds: number[],
  is_pvp: boolean,
  is_pvp_long: boolean
) => {
  // 1. Create the raid
  const { data: raid, error: raidError } = await supabase
    .from("raid")
    .insert([
      {
        type,
        dkp_summary,
        start_date: start_date.toISOString(),
        created_at: new Date().toISOString(),
        is_pvp,
        is_pvp_long,
      },
    ])
    .select()
    .maybeSingle();

  if (raidError || !raid) {
    console.error("Failed to create raid:", raidError);
    throw new Error("Ошибка при создании рейда");
  }

  // 2. Create raid_attendance entries
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

  // 3. Create raid_boss entries
  const bossData = bossIds.map((boss_id) => ({
    raid_id: raid.id,
    boss_id,
  }));

  const { error: bossError } = await supabase
    .from("raid_boss")
    .insert(bossData); // Removed invalid 'upsert' option

  if (bossError) {
    console.error("Failed to insert raid bosses:", bossError);
    throw new Error("Ошибка при добавлении боссов");
  }

  return raid;
};

export default createRaidEvent;
