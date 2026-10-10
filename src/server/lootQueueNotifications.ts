import "server-only";
import type { TransactionSql } from "postgres";
import type { ItemTypeRow, LootQueueRow } from "@/shared/lib/dbTypes";
import { ROLL_BASED_QUEUE_ITEMS } from "@/utils/rollBasedQueueItems";
import { notifyUser } from "./notifications";

export const IN_STOCK_STATUS = "В наличии";
export const LOOT_BUY_LINK = "/loot/buy";

const NOT_WAITING_STATUSES = ["позже", "пропуск", "продано"];

export async function getStockQuantity(tx: TransactionSql, itemTypeId: number) {
  const [stock] = await tx<{ quantity: number }[]>`
    SELECT COALESCE(SUM(quantity), 0)::int AS quantity
    FROM loot
    WHERE item_type_id = ${itemTypeId} AND status = ${IN_STOCK_STATUS}
  `;
  return stock.quantity;
}

export async function notifyFirstInQueueAboutStock(
  tx: TransactionSql,
  itemTypeId: number,
) {
  const [first] = await tx<
    (Pick<LootQueueRow, "user_id"> & Pick<ItemTypeRow, "name">)[]
  >`
    SELECT lq.user_id, it.name
    FROM loot_queue lq
    JOIN item_type it ON it.id = lq.item_type_id
    WHERE lq.item_type_id = ${itemTypeId}
      AND COALESCE(lq.status, '') <> ALL(${NOT_WAITING_STATUSES})
    ORDER BY
      CASE WHEN it.name = ANY(${ROLL_BASED_QUEUE_ITEMS})
           THEN -COALESCE(lq.roll, -1) END,
      (lq.position IS NULL), lq.position, lq.created_at
    LIMIT 1
  `;
  if (!first) return;

  await notifyUser(tx, {
    userId: first.user_id,
    kind: "lootInStock",
    message: `«${first.name}» уже на складе — вы первые в очереди`,
    link: LOOT_BUY_LINK,
  });
}
