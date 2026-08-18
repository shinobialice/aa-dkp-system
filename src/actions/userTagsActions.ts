"use server";
import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { triggerFinanceRecalcForCurrentMonth } from "./recalculateFinanceForMonth";

// 1. Get user tags
// Без asOf — только тэги, действующие прямо сейчас (для отображения в UI).
// С asOf — тэги, действовавшие на указанный момент (для перегенерации ЗП за
// прошлый месяц, чтобы более поздние снятия/добавления тэга её не меняли).
export async function getUserTags(userId: number, asOf?: Date) {
  try {
    if (asOf) {
      const asOfIso = asOf.toISOString();
      return await sql<any[]>`
        SELECT * FROM user_tags
        WHERE user_id = ${userId}
          AND created_at <= ${asOfIso}
          AND (removed_at IS NULL OR removed_at > ${asOfIso})
        ORDER BY created_at DESC
      `;
    }
    return await sql<any[]>`
      SELECT * FROM user_tags
      WHERE user_id = ${userId} AND removed_at IS NULL
      ORDER BY created_at DESC
    `;
  } catch (error) {
    console.error("Ошибка при получении тэгов:", error);
    throw new Error("Не удалось загрузить тэги");
  }
}

// 1b. Батч-версия getUserTags — один запрос на всех переданных пользователей
// сразу, вместо одного запроса на каждого (используется при расчёте причин
// отказа в ЗП для всей гильдии на странице /members).
export async function getUserTagsBatch(userIds: number[], asOf?: Date) {
  if (userIds.length === 0) return {} as Record<number, { tag: string }[]>;

  let data;
  try {
    if (asOf) {
      const asOfIso = asOf.toISOString();
      data = await sql<any[]>`
        SELECT * FROM user_tags
        WHERE user_id = ANY(${userIds})
          AND created_at <= ${asOfIso}
          AND (removed_at IS NULL OR removed_at > ${asOfIso})
        ORDER BY created_at DESC
      `;
    } else {
      data = await sql<any[]>`
        SELECT * FROM user_tags
        WHERE user_id = ANY(${userIds}) AND removed_at IS NULL
        ORDER BY created_at DESC
      `;
    }
  } catch (error) {
    console.error("Ошибка при получении тэгов:", error);
    throw new Error("Не удалось загрузить тэги");
  }

  const result: Record<number, any[]> = {};
  for (const row of data ?? []) {
    (result[row.user_id] ??= []).push(row);
  }
  return result;
}

// 2. Add a new tag
export async function addUserTag(userId: number, tag: string) {
  await ensurePrivilieges(["Администратор"]);

  let data;
  try {
    [data] = await sql<any[]>`
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

  // АФК/ДВ напрямую влияют на допуск/вес зарплаты (см. calculateSalaryWeight).
  await triggerFinanceRecalcForCurrentMonth();

  return data;
}

// 3. Remove tag by ID (soft delete — сохраняем историю, см. removed_at)
export async function deleteUserTag(tagId: number) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql<any[]>`
      UPDATE user_tags SET removed_at = now() WHERE id = ${tagId}
    `;
  } catch (error) {
    console.error("Ошибка при удалении тэга:", error);
    throw new Error("Не удалось удалить тэг");
  }

  await triggerFinanceRecalcForCurrentMonth();
}
