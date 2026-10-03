"use server";

import sql from "@/shared/lib/db";
import type { LootWishlistRow } from "@/shared/lib/dbTypes";

import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

type WishlistRow = Pick<LootWishlistRow, "id" | "item_name" | "comment">;

export type WishlistItem = {
  id: number;
  itemName: string;
  comment: string | null;
};

export async function addWishlistItem(
  userId: number,
  item: { itemName: string; comment: string },
): Promise<WishlistItem> {
  await ensurePrivilieges(["Администратор"]);
  let data: WishlistRow | undefined;
  try {
    [data] = await sql<WishlistRow[]>`
      INSERT INTO loot_wishlist (user_id, item_name, comment)
      VALUES (${userId}, ${item.itemName}, ${item.comment || null})
      RETURNING id, item_name, comment
    `;
  } catch (error) {
    console.error("Ошибка при добавлении пожелания:", error);
    throw new Error("Не удалось добавить пожелание");
  }

  if (!data) {
    console.error("Ошибка при добавлении пожелания: not returned");
    throw new Error("Не удалось добавить пожелание");
  }

  revalidatePath("/loot/giveaway");

  return {
    id: Number(data.id),
    itemName: data.item_name,
    comment: data.comment,
  };
}

export async function deleteWishlistItem(id: number) {
  await ensurePrivilieges(["Администратор"]);
  try {
    await sql`DELETE FROM loot_wishlist WHERE id = ${id}`;
  } catch (error) {
    console.error("Ошибка при удалении пожелания:", error);
    throw new Error("Не удалось удалить пожелание");
  }

  revalidatePath("/loot/giveaway");
}
