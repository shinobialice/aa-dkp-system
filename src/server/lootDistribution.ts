import "server-only";
import type { TransactionSql } from "postgres";
import type { LootRow, UserInventoryRow } from "@/shared/lib/dbTypes";
import { syncTreasuryGiveaway } from "./syncTreasuryGiveaway";

export type StockLotRow = LootRow & { item_type_name: string };

export type LotDistribution = {
  quantity: number;
  soldTo: string;
  soldToId?: number;
  isFree: boolean;
  comment?: string;
  price: number;
  soldAt: string;
};

export async function distributeLot(
  tx: TransactionSql,
  lot: StockLotRow,
  {
    quantity,
    soldTo,
    soldToId,
    isFree,
    comment,
    price,
    soldAt,
  }: LotDistribution,
) {
  const remaining = lot.quantity - quantity;
  const soldOut =
    remaining === 0 &&
    (lot.status === "В наличии" || lot.status === "Продаётся");

  await tx`
    UPDATE loot SET quantity = ${remaining}, status = ${soldOut ? "Распродано" : lot.status}
    WHERE id = ${lot.id}
  `;

  const [created] = await tx<Pick<LootRow, "id">[]>`
    INSERT INTO loot
      (item_type_id, source, acquired_at, quantity, sold_to, sold_to_user_id, sold_at, comment, status, price, created_at)
    VALUES (
      ${lot.item_type_id}, ${lot.source}, ${lot.acquired_at ?? soldAt}, ${quantity},
      ${soldTo}, ${soldToId ?? null}, ${soldAt}, ${comment ?? null},
      ${isFree ? "Выдано" : "Продано"}, ${price}, now()
    )
    RETURNING id
  `;
  if (!created) throw new Error("Ошибка при создании новой записи лута");
  if (!soldToId) return;

  const alreadyOwned =
    isFree && (await ownsItem(tx, soldToId, lot.item_type_name));
  if (!alreadyOwned) {
    await tx`
      INSERT INTO user_inventory (user_id, name, type, created_at, quantity, loot_id)
      VALUES (
        ${soldToId}, ${lot.item_type_name}, ${isFree ? "Выдано" : "Куплено"},
        now(), ${quantity}, ${created.id}
      )
    `;
  }

  if (isFree) {
    await syncTreasuryGiveaway(tx, {
      treasuryName: lot.item_type_name,
      userId: soldToId,
      givenAt: soldAt,
    });
  }
}

async function ownsItem(tx: TransactionSql, userId: number, name: string) {
  const rows = await tx<Pick<UserInventoryRow, "id">[]>`
    SELECT id FROM user_inventory WHERE user_id = ${userId} AND name = ${name} LIMIT 1
  `;
  return rows.length > 0;
}
