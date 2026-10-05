"use server";
import sql from "@/shared/lib/db";
import { publishChanges } from "@/server/liveChanges";
import ensurePrivilieges from "./ensurePrivilieges";

export async function updateItemTypePrice(name: string, price: number | null) {
  await ensurePrivilieges(["Администратор"]);
  try {
    await sql`
      UPDATE item_type SET price = ${price} WHERE name = ${name}
    `;
  } catch (error) {
    console.error("Ошибка при обновлении цены предмета:", error);
    throw new Error("Не удалось обновить цену");
  }
  await publishChanges("loot");
}
