"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export type MiscLootGrant = {
  id: number;
  comment: string;
  amount: number | null;
  date: string;
};

export async function addMiscLootGrant(
  userId: number,
  grant: { comment: string; amount: number | null; date: string },
): Promise<MiscLootGrant> {
  const { data, error } = await supabase
    .from("misc_loot_grants")
    .insert({
      user_id: userId,
      comment: grant.comment,
      amount: grant.amount,
      date: new Date(grant.date).toISOString(),
    })
    .select("id, comment, amount, date")
    .single();

  if (error || !data) {
    console.error("Ошибка при добавлении записи в прочее:", error);
    throw new Error("Не удалось добавить запись");
  }

  revalidatePath("/loot/giveaway");

  return {
    id: data.id,
    comment: data.comment,
    amount: data.amount === null ? null : Number(data.amount),
    date: data.date.split("T")[0],
  };
}

export async function deleteMiscLootGrant(id: number) {
  const { error } = await supabase
    .from("misc_loot_grants")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Ошибка при удалении записи из прочее:", error);
    throw new Error("Не удалось удалить запись");
  }

  revalidatePath("/loot/giveaway");
}
