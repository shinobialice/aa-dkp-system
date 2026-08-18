"use server";
import sql from "@/shared/lib/db";

export async function updateItemTypePrice(name: string, price: number | null) {
  try {
    await sql<any[]>`
      UPDATE item_type SET price = ${price} WHERE name = ${name}
    `;
  } catch (error) {
    console.error("Ошибка при обновлении цены предмета:", error);
    throw new Error("Не удалось обновить цену");
  }
}
