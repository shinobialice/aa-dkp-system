"use server";

import { revalidatePath } from "next/cache";
import sql from "@/shared/lib/db";
import { triggerFinanceRecalc } from "./recalculateFinanceForMonth";

export const getExpenses = async () => {
  try {
    return await sql<any[]>`SELECT * FROM "Expense" ORDER BY date DESC`;
  } catch (error) {
    console.error("Ошибка при получении расходов:", error);
    throw new Error("Не удалось получить расходы");
  }
};

export const getExpensesBySource = async (source: string) => {
  try {
    return await sql<any[]>`
      SELECT * FROM "Expense" WHERE source = ${source} ORDER BY date DESC
    `;
  } catch (error) {
    console.error("Ошибка при получении расходов пользователя:", error);
    throw new Error("Не удалось получить расходы пользователя");
  }
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

  try {
    await sql<any[]>`
      INSERT INTO "Expense" (date, amount, target, source, comment)
      VALUES (${new Date(date).toISOString()}, ${amount}, ${target}, ${source}, ${comment ?? null})
    `;
  } catch (error) {
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

  try {
    await sql<any[]>`
      UPDATE "Expense" SET
        date = ${new Date(date).toISOString()},
        amount = ${amount},
        target = ${target},
        source = ${source},
        comment = ${comment ?? null}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Ошибка при обновлении расхода:", error);
    throw new Error("Не удалось обновить расход");
  }

  revalidatePath("/loot");

  const expenseDate = new Date(date);
  await triggerFinanceRecalc(expenseDate.getMonth() + 1, expenseDate.getFullYear());
};

export const deleteExpense = async (id: number, date: string) => {
  try {
    await sql<any[]>`DELETE FROM "Expense" WHERE id = ${id}`;
  } catch (error) {
    console.error("Ошибка при удалении расхода:", error);
    throw new Error("Не удалось удалить расход");
  }

  revalidatePath("/loot");

  const expenseDate = new Date(date);
  await triggerFinanceRecalc(expenseDate.getMonth() + 1, expenseDate.getFullYear());
};
