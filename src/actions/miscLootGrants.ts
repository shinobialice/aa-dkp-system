"use server";

import sql from "@/shared/lib/db";
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
  let data;
  try {
    [data] = await sql<any[]>`
      INSERT INTO misc_loot_grants (user_id, comment, amount, date)
      VALUES (${userId}, ${grant.comment}, ${grant.amount}, ${new Date(grant.date).toISOString()})
      RETURNING id, comment, amount, date
    `;
  } catch (error) {
    console.error("Ошибка при добавлении записи в прочее:", error);
    throw new Error("Не удалось добавить запись");
  }

  if (!data) {
    console.error("Ошибка при добавлении записи в прочее: not returned");
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
  try {
    await sql<any[]>`DELETE FROM misc_loot_grants WHERE id = ${id}`;
  } catch (error) {
    console.error("Ошибка при удалении записи из прочее:", error);
    throw new Error("Не удалось удалить запись");
  }

  revalidatePath("/loot/giveaway");
}
