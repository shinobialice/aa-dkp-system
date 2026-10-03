"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";

export async function deleteLootItem(id: number) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql`DELETE FROM loot WHERE id = ${id}`;
  } catch (error) {
    console.error("Failed to delete loot item:", error);
    throw new Error("Ошибка при удалении предмета");
  }
}
