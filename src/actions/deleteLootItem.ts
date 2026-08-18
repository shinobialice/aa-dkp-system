"use server";
import sql from "@/shared/lib/db";

export async function deleteLootItem(id: number) {
  try {
    await sql<any[]>`DELETE FROM loot WHERE id = ${id}`;
  } catch (error) {
    console.error("Failed to delete loot item:", error);
    throw new Error("Ошибка при удалении предмета");
  }
}
