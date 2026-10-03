"use server";
import sql from "@/shared/lib/db";
import type { UserInventoryRow } from "@/shared/lib/dbTypes";

export type InventoryItem = Omit<UserInventoryRow, "loot_id">;

const getUserInventory = async (userId: number) => {
  try {
    return await sql<InventoryItem[]>`
      SELECT id, user_id, type, name, quality, created_at, quantity
      FROM user_inventory
      WHERE user_id = ${userId}
    `;
  } catch (error) {
    console.error("Ошибка при получении инвентаря пользователя:", error);
    throw new Error("Не удалось получить инвентарь");
  }
};

export default getUserInventory;
