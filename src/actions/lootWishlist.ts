"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export type WishlistItem = {
  id: number;
  itemName: string;
  comment: string | null;
};

export async function addWishlistItem(
  userId: number,
  item: { itemName: string; comment: string },
): Promise<WishlistItem> {
  const { data, error } = await supabase
    .from("loot_wishlist")
    .insert({
      user_id: userId,
      item_name: item.itemName,
      comment: item.comment || null,
    })
    .select("id, item_name, comment")
    .single();

  if (error || !data) {
    console.error("Ошибка при добавлении пожелания:", error);
    throw new Error("Не удалось добавить пожелание");
  }

  revalidatePath("/loot/giveaway");

  return { id: data.id, itemName: data.item_name, comment: data.comment };
}

export async function deleteWishlistItem(id: number) {
  const { error } = await supabase.from("loot_wishlist").delete().eq("id", id);

  if (error) {
    console.error("Ошибка при удалении пожелания:", error);
    throw new Error("Не удалось удалить пожелание");
  }

  revalidatePath("/loot/giveaway");
}
