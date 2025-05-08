"use server";

import supabase from "@/lib/supabase";

export default async function deleteEvent(eventId: number) {
  // 1. Delete raid attendance entries
  const { error: attendanceError } = await supabase
    .from("raid_attendance")
    .delete()
    .eq("raid_id", eventId);

  if (attendanceError) {
    console.error("Failed to delete raid attendance:", attendanceError);
    throw new Error("Ошибка при удалении посещаемости");
  }

  // 2. Delete raid boss entries
  const { error: bossError } = await supabase
    .from("raid_boss")
    .delete()
    .eq("raid_id", eventId);

  if (bossError) {
    console.error("Failed to delete raid bosses:", bossError);
    throw new Error("Ошибка при удалении боссов");
  }

  // 3. Delete the raid itself
  const { error: raidError } = await supabase
    .from("raid")
    .delete()
    .eq("id", eventId);

  if (raidError) {
    console.error("Failed to delete raid:", raidError);
    throw new Error("Ошибка при удалении события");
  }
}
