"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/shared/lib/supabaseAdmin";

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
};
