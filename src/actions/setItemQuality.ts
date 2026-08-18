"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";

const setItemQuality = async (itemId: number, quality: string) => {
  const [item] = await sql<any[]>`
    SELECT user_id FROM user_inventory WHERE id = ${itemId}
  `;

  if (!item) {
    throw new Error("Не удалось обновить качество предмета");
  }

  await ensureCanEditUserData(item.user_id, "inventoryEditEnabled");

  let data;
  try {
    [data] = await sql<any[]>`
      UPDATE user_inventory SET quality = ${quality} WHERE id = ${itemId} RETURNING *
    `;
  } catch (error) {
    console.error("Ошибка при обновлении качества предмета:", error);
    throw new Error("Не удалось обновить качество предмета");
  }

  if (!data) {
    console.error("Ошибка при обновлении качества предмета: not found");
    throw new Error("Не удалось обновить качество предмета");
  }

  return data;
};

export default setItemQuality;
