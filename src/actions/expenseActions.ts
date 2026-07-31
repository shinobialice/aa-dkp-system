"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/shared/lib/supabaseAdmin";
import { triggerFinanceRecalc } from "./recalculateFinanceForMonth";

export const getExpenses = async () => {
  const { data, error } = await supabase
    .from("Expense")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Ошибка при получении расходов:", error);
    throw new Error("Не удалось получить расходы");
  }

  return data;
};

export const addExpense = async ({
  date,
  amount,
  target,
  source,
  comment,
}: {
  date: string;
  amount: number;
  target: string;
  source: string;
  comment?: string;
}) => {
  if (amount <= 0) {
    throw new Error("Сумма расхода должна быть больше 0");
  }
  if (!date) {
    throw new Error("Дата обязательна");
  }
  if (!target.trim()) {
    throw new Error("Получатель обязателен");
  }
  if (!source.trim()) {
    throw new Error("Источник обязателен");
  }

  const { error } = await supabase.from("Expense").insert([
    {
      date: new Date(date).toISOString(),
      amount,
      target,
      source,
      comment,
    },
  ]);

  if (error) {
    console.error("Ошибка при добавлении расхода:", error);
    throw new Error("Не удалось добавить расход");
  }

  revalidatePath("/loot");

  const expenseDate = new Date(date);
  await triggerFinanceRecalc(expenseDate.getMonth() + 1, expenseDate.getFullYear());
};

export const updateExpense = async ({
  id,
  date,
  amount,
  target,
  source,
  comment,
}: {
  id: number;
  date: string;
  amount: number;
  target: string;
  source: string;
  comment?: string;
}) => {
  if (amount <= 0) {
    throw new Error("Сумма расхода должна быть больше 0");
  }
  if (!date) {
    throw new Error("Дата обязательна");
  }
  if (!target.trim()) {
    throw new Error("Получатель обязателен");
  }
  if (!source.trim()) {
    throw new Error("Источник обязателен");
  }

  const { error } = await supabase
    .from("Expense")
    .update({
      date: new Date(date).toISOString(),
      amount,
      target,
      source,
      comment,
    })
    .eq("id", id);

  if (error) {
    console.error("Ошибка при обновлении расхода:", error);
    throw new Error("Не удалось обновить расход");
  }

  revalidatePath("/loot");

  const expenseDate = new Date(date);
  await triggerFinanceRecalc(expenseDate.getMonth() + 1, expenseDate.getFullYear());
};

export const deleteExpense = async (id: number, date: string) => {
  const { error } = await supabase.from("Expense").delete().eq("id", id);

  if (error) {
    console.error("Ошибка при удалении расхода:", error);
    throw new Error("Не удалось удалить расход");
  }

  revalidatePath("/loot");

  const expenseDate = new Date(date);
  await triggerFinanceRecalc(expenseDate.getMonth() + 1, expenseDate.getFullYear());
};
