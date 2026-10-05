"use server";

import { revalidatePath } from "next/cache";
import { triggerFinanceRecalc } from "@/server/finance/recalc";
import { publishChanges } from "@/server/liveChanges";
import sql from "@/shared/lib/db";
import type { ExpenseRow } from "@/shared/lib/dbTypes";
import { getUtcYearMonth } from "@/utils/getUtcYearMonth";
import ensurePrivilieges from "./ensurePrivilieges";

type ExpenseInput = {
  date: string;
  amount: number;
  target: string;
  source: string;
  comment?: string;
};

export const getExpenses = async () => {
  try {
    return await sql<ExpenseRow[]>`SELECT * FROM "Expense" ORDER BY date DESC`;
  } catch (error) {
    console.error("Ошибка при получении расходов:", error);
    throw new Error("Не удалось получить расходы");
  }
};

export const getExpensesBySource = async (source: string) => {
  try {
    return await sql<ExpenseRow[]>`
      SELECT * FROM "Expense" WHERE source = ${source} ORDER BY date DESC
    `;
  } catch (error) {
    console.error("Ошибка при получении расходов пользователя:", error);
    throw new Error("Не удалось получить расходы пользователя");
  }
};

export const addExpense = async (input: ExpenseInput) => {
  await ensurePrivilieges(["Администратор"]);
  validateExpense(input);

  try {
    await sql`
      INSERT INTO "Expense" (date, amount, target, source, comment)
      VALUES (
        ${new Date(input.date).toISOString()}, ${input.amount}, ${input.target},
        ${input.source}, ${input.comment ?? null}
      )
    `;
  } catch (error) {
    console.error("Ошибка при добавлении расхода:", error);
    throw new Error("Не удалось добавить расход");
  }

  revalidatePath("/loot");
  await publishChanges("loot");
  await recalcMonths([input.date]);
};

export const updateExpense = async ({
  id,
  ...input
}: ExpenseInput & { id: number }) => {
  await ensurePrivilieges(["Администратор"]);
  validateExpense(input);

  const [previous] = await sql<Pick<ExpenseRow, "date">[]>`
    SELECT date FROM "Expense" WHERE id = ${id}
  `;

  try {
    await sql`
      UPDATE "Expense" SET
        date = ${new Date(input.date).toISOString()},
        amount = ${input.amount},
        target = ${input.target},
        source = ${input.source},
        comment = ${input.comment ?? null}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Ошибка при обновлении расхода:", error);
    throw new Error("Не удалось обновить расход");
  }

  revalidatePath("/loot");
  await publishChanges("loot");
  await recalcMonths(previous ? [input.date, previous.date] : [input.date]);
};

export const deleteExpense = async (id: number, date: string) => {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql`DELETE FROM "Expense" WHERE id = ${id}`;
  } catch (error) {
    console.error("Ошибка при удалении расхода:", error);
    throw new Error("Не удалось удалить расход");
  }

  revalidatePath("/loot");
  await publishChanges("loot");
  await recalcMonths([date]);
};

function validateExpense({ date, amount, target, source }: ExpenseInput) {
  if (amount <= 0) throw new Error("Сумма расхода должна быть больше 0");
  if (!date) throw new Error("Дата обязательна");
  if (!target.trim()) throw new Error("Получатель обязателен");
  if (!source.trim()) throw new Error("Источник обязателен");
}

async function recalcMonths(dates: string[]) {
  const months = new Set(
    dates.map((date) => {
      const { year, month } = getUtcYearMonth(new Date(date));
      return `${year}-${month}`;
    }),
  );
  for (const key of months) {
    const [year, month] = key.split("-").map(Number);
    await triggerFinanceRecalc(month, year);
  }
}
