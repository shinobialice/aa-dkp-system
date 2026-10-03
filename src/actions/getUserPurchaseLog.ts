"use server";

import sql from "@/shared/lib/db";
import type {
  GivenawaylootRow,
  ItemTypeRow,
  LootRow,
} from "@/shared/lib/dbTypes";
import { treasuryGiveawaySyncItems } from "@/widgets/Loot/LootGiveaway/treasuryGiveawaySync";

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

type CatalogFields = {
  item_type_icon_url: ItemTypeRow["icon_url"];
  item_type_grade: ItemTypeRow["grade"] | null;
};

type TreasuryRow = Pick<
  LootRow,
  "id" | "quantity" | "comment" | "status" | "sold_at"
> &
  CatalogFields & { item_type_name: string };

type GiveawayRow = Pick<GivenawaylootRow, "id" | "name" | "date" | "comment"> &
  CatalogFields;

export const getUserPurchaseLog = async (
  userId: number,
): Promise<InventoryLogEntry[]> => {
  const [lootRows, giveawayRows] = await Promise.all([
    sql<TreasuryRow[]>`
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
    // У раздачи лута нет ссылки на item_type, иконка ищется по имени.
    sql<GiveawayRow[]>`
      SELECT
        g.id, g.name, g.date, g.comment,
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
    name: row.item_type_name,
    type: row.status === "Выдано" ? "Выдано" : "Куплено",
    source: "Казна",
    date: row.sold_at,
    quantity: row.quantity,
    comment: row.comment,
    iconUrl: row.item_type_icon_url,
    grade: row.item_type_grade,
  }));

  const giveawayNamesGivenFromTreasury = new Set(
    lootRows
      .filter((row) => row.status === "Выдано")
      .flatMap((row) =>
        treasuryGiveawaySyncItems
          .filter((item) => item.treasuryName === row.item_type_name)
          .map((item) => item.giveawayName),
      ),
  );

  const fromGiveaway: InventoryLogEntry[] = giveawayRows
    .filter((row) => !giveawayNamesGivenFromTreasury.has(row.name))
    .map((row) => ({
      id: `giveaway-${row.id}`,
      name: row.name,
      type: "Выдано",
      source: "Раздача лута",
      date: row.date,
      quantity: 1,
      comment: row.comment,
      iconUrl: row.item_type_icon_url,
      grade: row.item_type_grade,
    }));

  return [...fromTreasury, ...fromGiveaway].sort(
    (a, b) => timeOf(b.date) - timeOf(a.date),
  );
};

function timeOf(date: string | null) {
  return date ? new Date(date).getTime() : 0;
}
