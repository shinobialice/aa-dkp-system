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
  iconUrl: string | null;
  grade: number | null;
};

export const getUserPurchaseLog = async (
  userId: number,
): Promise<InventoryLogEntry[]> => {
  const [lootRows, giveawayRows] = await Promise.all([
    sql<any[]>`
      SELECT
        l.id, l.quantity, l.comment, l.status, l.sold_at,
        it.name AS item_type_name, it.icon_url AS item_type_icon_url, it.grade AS item_type_grade
      FROM loot l
      JOIN item_type it ON it.id = l.item_type_id
      WHERE l.sold_to_user_id = ${userId} AND l.status = ANY(${["Продано", "Выдано"]})
    `.catch((error) => {
      console.error("Ошибка при получении покупок/выдач из казны:", error);
      throw new Error("Не удалось получить покупки/выдачи из казны");
    }),
    // У раздачи лута нет своей ссылки на item_type (только текстовое имя) —
    // подтягиваем иконку/грейд по совпадению имени с каталогом казны, если
    // такой предмет там есть; для остальных иконка просто не покажется, как
    // и раньше.
    sql<any[]>`
      SELECT
        g.id, g.name, g.date, g.comment, g.status,
        it.icon_url AS item_type_icon_url, it.grade AS item_type_grade
      FROM givenawayloot g
      LEFT JOIN item_type it ON it.name = g.name
      WHERE g.user_id = ${userId} AND g.status = 'Выдано'
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
    iconUrl: row.item_type_icon_url ?? null,
    grade: row.item_type_grade ?? null,
  }));

  const fromGiveaway: InventoryLogEntry[] = giveawayRows.map((row) => ({
    id: `giveaway-${row.id}`,
    name: row.name,
    type: "Выдано",
    source: "Раздача лута",
    date: row.date,
    quantity: 1,
    comment: row.comment,
    iconUrl: row.item_type_icon_url ?? null,
    grade: row.item_type_grade ?? null,
  }));

  return [...fromTreasury, ...fromGiveaway].sort((a, b) => {
    const at = a.date ? new Date(a.date).getTime() : 0;
    const bt = b.date ? new Date(b.date).getTime() : 0;
    return bt - at;
  });
};
