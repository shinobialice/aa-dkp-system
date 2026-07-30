"use server";
import supabase from "@/shared/lib/supabaseAdmin";
import ensurePrivilieges from "./ensurePrivilieges";
import { triggerFinanceRecalcForCurrentMonth } from "./recalculateFinanceForMonth";

// 1. Get user tags
// Без asOf — только тэги, действующие прямо сейчас (для отображения в UI).
// С asOf — тэги, действовавшие на указанный момент (для перегенерации ЗП за
// прошлый месяц, чтобы более поздние снятия/добавления тэга её не меняли).
export async function getUserTags(userId: number, asOf?: Date) {
  let query = supabase.from("user_tags").select("*").eq("user_id", userId);

  if (asOf) {
    const asOfIso = asOf.toISOString();
    query = query
      .lte("created_at", asOfIso)
      .or(`removed_at.is.null,removed_at.gt.${asOfIso}`);
  } else {
    query = query.is("removed_at", null);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error("Ошибка при получении тэгов:", error);
    throw new Error("Не удалось загрузить тэги");
  }

  return data;
}

// 1b. Батч-версия getUserTags — один запрос на всех переданных пользователей
// сразу, вместо одного запроса на каждого (используется при расчёте причин
// отказа в ЗП для всей гильдии на странице /members).
export async function getUserTagsBatch(userIds: number[], asOf?: Date) {
  if (userIds.length === 0) return {} as Record<number, { tag: string }[]>;

  let query = supabase.from("user_tags").select("*").in("user_id", userIds);

  if (asOf) {
    const asOfIso = asOf.toISOString();
    query = query
      .lte("created_at", asOfIso)
      .or(`removed_at.is.null,removed_at.gt.${asOfIso}`);
  } else {
    query = query.is("removed_at", null);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error("Ошибка при получении тэгов:", error);
    throw new Error("Не удалось загрузить тэги");
  }

  const result: Record<number, NonNullable<typeof data>> = {};
  for (const row of data ?? []) {
    (result[row.user_id] ??= []).push(row);
  }
  return result;
}

// 2. Add a new tag
export async function addUserTag(userId: number, tag: string) {
  await ensurePrivilieges(["Администратор"]);

  const { data, error } = await supabase
    .from("user_tags")
    .insert([{ user_id: userId, tag }])
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("Ошибка при добавлении тэга:", error);
    throw new Error("Не удалось добавить тэг");
  }

  // АФК/ДВ напрямую влияют на допуск/вес зарплаты (см. calculateSalaryWeight).
  await triggerFinanceRecalcForCurrentMonth();

  return data;
}

// 3. Remove tag by ID (soft delete — сохраняем историю, см. removed_at)
export async function deleteUserTag(tagId: number) {
  await ensurePrivilieges(["Администратор"]);

  const { error } = await supabase
    .from("user_tags")
    .update({ removed_at: new Date().toISOString() })
    .eq("id", tagId);

  if (error) {
    console.error("Ошибка при удалении тэга:", error);
    throw new Error("Не удалось удалить тэг");
  }

  await triggerFinanceRecalcForCurrentMonth();
}
