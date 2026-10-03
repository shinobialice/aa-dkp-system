"use server";

import sql from "@/shared/lib/db";
import type { MiscLootGrantsRow } from "@/shared/lib/dbTypes";

import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

type GrantRow = Pick<MiscLootGrantsRow, "id" | "comment" | "amount" | "date">;

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
  await ensurePrivilieges(["Администратор"]);
  let data: GrantRow | undefined;
  try {
    [data] = await sql<GrantRow[]>`
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
    id: Number(data.id),
    comment: data.comment,
    amount: data.amount,
    date: data.date.split("T")[0],
  };
}

export async function deleteMiscLootGrant(id: number) {
  await ensurePrivilieges(["Администратор"]);
  try {
    await sql`DELETE FROM misc_loot_grants WHERE id = ${id}`;
  } catch (error) {
    console.error("Ошибка при удалении записи из прочее:", error);
    throw new Error("Не удалось удалить запись");
  }

  revalidatePath("/loot/giveaway");
}
