"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import ensurePrivilieges from "./ensurePrivilieges";

export default async function deleteEvent(eventId: number) {
  await ensurePrivilieges(["Администратор", "Raid Manager", "Модератор"]);

  const { error: attendanceError } = await supabase
    .from("raid_attendance")
    .delete()
    .eq("raid_id", eventId);

  if (attendanceError) {
    console.error("Failed to delete raid attendance:", attendanceError);
    throw new Error("Ошибка при удалении посещаемости");
  }

  const { error: bossError } = await supabase
    .from("raid_boss")
    .delete()
    .eq("raid_id", eventId);

  if (bossError) {
    console.error("Failed to delete raid bosses:", bossError);
    throw new Error("Ошибка при удалении боссов");
  }

  const { error: raidError } = await supabase
    .from("raid")
    .delete()
    .eq("id", eventId);

  if (raidError) {
    console.error("Failed to delete raid:", raidError);
    throw new Error("Ошибка при удалении события");
  }
}
