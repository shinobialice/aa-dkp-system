"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { triggerFinanceRecalc } from "./recalculateFinanceForMonth";

export default async function deleteEvent(eventId: number) {
  await ensurePrivilieges([
    "Администратор",
    "Raid Manager",
    "Модератор",
    "Секретутка",
  ]);

  const [raid] = await sql<any[]>`
    SELECT start_date FROM raid WHERE id = ${eventId}
  `;

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

  if (raid?.start_date) {
    const date = new Date(raid.start_date);
    await triggerFinanceRecalc(date.getMonth() + 1, date.getFullYear());
  }
}
