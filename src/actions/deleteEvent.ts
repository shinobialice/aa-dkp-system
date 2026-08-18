"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";

export default async function deleteEvent(eventId: number) {
  await ensurePrivilieges([
    "Администратор",
    "Raid Manager",
    "Модератор",
    "Секретутка",
  ]);

  try {
    await sql<any[]>`DELETE FROM raid_attendance WHERE raid_id = ${eventId}`;
  } catch (attendanceError) {
    console.error("Failed to delete raid attendance:", attendanceError);
    throw new Error("Ошибка при удалении посещаемости");
  }

  try {
    await sql<any[]>`DELETE FROM raid_boss WHERE raid_id = ${eventId}`;
  } catch (bossError) {
    console.error("Failed to delete raid bosses:", bossError);
    throw new Error("Ошибка при удалении боссов");
  }

  try {
    await sql<any[]>`DELETE FROM raid WHERE id = ${eventId}`;
  } catch (raidError) {
    console.error("Failed to delete raid:", raidError);
    throw new Error("Ошибка при удалении события");
  }
}
