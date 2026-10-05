"use server";
import sql from "@/shared/lib/db";
import type { UserTagsRow } from "@/shared/lib/dbTypes";
import ensurePrivilieges from "./ensurePrivilieges";
import { triggerFinanceRecalcForCurrentMonth } from "@/server/finance/recalc";
import { publishChanges } from "@/server/liveChanges";

// asOf задаёт момент, на который нужны тэги: при перегенерации ЗП за прошлый
// месяц более поздние снятия/добавления тэга не должны её менять.
function activeAt(asOf?: Date) {
  if (!asOf) return sql`removed_at IS NULL`;
  const asOfIso = asOf.toISOString();
  return sql`created_at <= ${asOfIso} AND (removed_at IS NULL OR removed_at > ${asOfIso})`;
}

export async function getUserTags(userId: number, asOf?: Date) {
  try {
    return await sql<UserTagsRow[]>`
      SELECT * FROM user_tags
      WHERE user_id = ${userId} AND ${activeAt(asOf)}
      ORDER BY created_at DESC
    `;
  } catch (error) {
    console.error("Ошибка при получении тэгов:", error);
    throw new Error("Не удалось загрузить тэги");
  }
}

export async function getUserTagsBatch(
  userIds: number[],
  asOf?: Date,
): Promise<Record<number, UserTagsRow[]>> {
  if (userIds.length === 0) return {};

  let data: UserTagsRow[];
  try {
    data = await sql<UserTagsRow[]>`
      SELECT * FROM user_tags
      WHERE user_id = ANY(${userIds}) AND ${activeAt(asOf)}
      ORDER BY created_at DESC
    `;
  } catch (error) {
    console.error("Ошибка при получении тэгов:", error);
    throw new Error("Не удалось загрузить тэги");
  }

  const result: Record<number, UserTagsRow[]> = {};
  for (const row of data) {
    (result[row.user_id] ??= []).push(row);
  }
  return result;
}

export async function addUserTag(userId: number, tag: string) {
  await ensurePrivilieges(["Администратор"]);

  let data: UserTagsRow | undefined;
  try {
    [data] = await sql<UserTagsRow[]>`
      INSERT INTO user_tags (user_id, tag) VALUES (${userId}, ${tag}) RETURNING *
    `;
  } catch (error) {
    console.error("Ошибка при добавлении тэга:", error);
    throw new Error("Не удалось добавить тэг");
  }

  if (!data) {
    console.error("Ошибка при добавлении тэга: not returned");
    throw new Error("Не удалось добавить тэг");
  }

  await publishChanges("members");
  await triggerFinanceRecalcForCurrentMonth();

  return data;
}

export async function deleteUserTag(tagId: number) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql`
      UPDATE user_tags SET removed_at = now() WHERE id = ${tagId}
    `;
  } catch (error) {
    console.error("Ошибка при удалении тэга:", error);
    throw new Error("Не удалось удалить тэг");
  }

  await publishChanges("members");
  await triggerFinanceRecalcForCurrentMonth();
}
