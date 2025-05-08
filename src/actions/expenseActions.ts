"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/lib/supabase";

export const getExpenses = async () => {
  const { data, error } = await supabase
    .from("expense")
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
  const { error } = await supabase.from("expense").insert([
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
