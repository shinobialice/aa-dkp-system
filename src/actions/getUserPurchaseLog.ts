"use server";

import sql from "@/shared/lib/db";

export type InventoryLogEntry = {
  id: string;
  name: string;
  type: "Куплено" | "Выдано";
  source: "Казна" | "Раздача лута";
  date: string | null;
  quantity: number;
  comment: string | null;
};

export const getUserPurchaseLog = async (
  userId: number,
): Promise<InventoryLogEntry[]> => {
  const [lootRows, giveawayRows] = await Promise.all([
    sql<any[]>`
      SELECT l.id, l.quantity, l.comment, l.status, l.sold_at, it.name AS item_type_name
      FROM loot l
      JOIN item_type it ON it.id = l.item_type_id
      WHERE l.sold_to_user_id = ${userId} AND l.status = ANY(${["Продано", "Выдано"]})
    `.catch((error) => {
      console.error("Ошибка при получении покупок/выдач из казны:", error);
      throw new Error("Не удалось получить покупки/выдачи из казны");
    }),
    sql<any[]>`
      SELECT id, name, date, comment, status FROM givenawayloot
      WHERE user_id = ${userId} AND status = 'Выдано'
    `.catch((error) => {
      console.error("Ошибка при получении раздач лута:", error);
      throw new Error("Не удалось получить раздачи лута");
    }),
  ]);

  const fromTreasury: InventoryLogEntry[] = lootRows.map((row) => ({
    id: `loot-${row.id}`,
    name: row.item_type_name ?? "Неизвестный предмет",
    type: row.status === "Выдано" ? "Выдано" : "Куплено",
    source: "Казна",
    date: row.sold_at,
    quantity: row.quantity ?? 1,
    comment: row.comment,
  }));

  const fromGiveaway: InventoryLogEntry[] = giveawayRows.map((row) => ({
    id: `giveaway-${row.id}`,
    name: row.name,
    type: "Выдано",
    source: "Раздача лута",
    date: row.date,
    quantity: 1,
    comment: row.comment,
  }));

  return [...fromTreasury, ...fromGiveaway].sort((a, b) => {
    const at = a.date ? new Date(a.date).getTime() : 0;
    const bt = b.date ? new Date(b.date).getTime() : 0;
    return bt - at;
  });
};
