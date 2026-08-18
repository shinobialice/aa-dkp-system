"use server";
import sql from "@/shared/lib/db";

const getUserInventory = async (userId: number) => {
  try {
    const inventory = await sql<any[]>`
      SELECT id, user_id, type, name, quality, created_at, quantity
      FROM user_inventory
      WHERE user_id = ${userId}
    `;
    return inventory;
  } catch (error) {
    console.error("Ошибка при получении инвентаря пользователя:", error);
    throw new Error("Не удалось получить инвентарь");
  }
};

export default getUserInventory;
