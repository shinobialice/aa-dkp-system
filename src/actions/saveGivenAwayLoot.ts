"use server";

import sql from "@/shared/lib/db";
import type { UserInventoryRow } from "@/shared/lib/dbTypes";
import ensurePrivilieges from "./ensurePrivilieges";

export const saveGivenAwayLoot = async (
  userId: number,
  item: { name: string; date: string; comment?: string; status: string },
) => {
  await ensurePrivilieges(["Администратор"]);
  const dateObj = new Date(item.date).toISOString();

  let existing: { id: number } | undefined;
  try {
    [existing] = await sql<{ id: number }[]>`
      SELECT id FROM givenawayloot WHERE user_id = ${userId} AND name = ${item.name}
    `;
  } catch (findError) {
    console.error("Ошибка при поиске записи givenawayloot:", findError);
    throw new Error("Не удалось сохранить выданный лут");
  }

  if (existing) {
    try {
      await sql`
        UPDATE givenawayloot SET date = ${dateObj}, comment = ${item.comment ?? null}, status = ${item.status}
        WHERE id = ${existing.id}
      `;
    } catch {
      throw new Error("Ошибка при обновлении выданного лута");
    }
  } else {
    try {
      await sql`
        INSERT INTO givenawayloot (user_id, name, date, comment, status, created_at)
        VALUES (${userId}, ${item.name}, ${dateObj}, ${item.comment ?? null}, ${item.status}, now())
      `;
    } catch {
      throw new Error("Ошибка при создании выданного лута");
    }
  }

  if (item.status === "Выдано") {
    let inventoryRow: Pick<UserInventoryRow, "id" | "type"> | undefined;
    try {
      [inventoryRow] = await sql<Pick<UserInventoryRow, "id" | "type">[]>`
        SELECT id, type FROM user_inventory
        WHERE user_id = ${userId} AND name = ${item.name}
        LIMIT 1
      `;
    } catch (inventoryFindError) {
      console.error("Ошибка при поиске инвентаря:", inventoryFindError);
      throw new Error("Не удалось проверить инвентарь");
    }

    if (!inventoryRow) {
      try {
        await sql`
          INSERT INTO user_inventory (user_id, name, type, created_at)
          VALUES (${userId}, ${item.name}, 'Выдано', ${dateObj})
        `;
      } catch {
        throw new Error("Ошибка при добавлении предмета в инвентарь");
      }
    } else if (inventoryRow.type === "Выдано") {
      try {
        await sql`
          UPDATE user_inventory SET created_at = ${dateObj} WHERE id = ${inventoryRow.id}
        `;
      } catch {
        throw new Error("Ошибка при обновлении инвентаря");
      }
    }
  } else {
    try {
      await sql`
        DELETE FROM user_inventory WHERE user_id = ${userId} AND name = ${item.name} AND type = 'Выдано'
      `;
    } catch {
      throw new Error("Ошибка при удалении предмета из инвентаря");
    }
  }
};
