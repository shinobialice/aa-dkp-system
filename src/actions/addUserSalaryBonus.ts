"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { triggerFinanceRecalcForCurrentMonth } from "./recalculateFinanceForMonth";

export async function addUserSalaryBonus({
  userId,
  amount,
  reason,
}: {
  userId: number;
  amount: number;
  reason: string;
}) {
  await ensurePrivilieges(["Администратор"]);

  if (amount <= 0) {
    throw new Error("Бонус должен быть больше 0%");
  }
  if (!reason.trim()) {
    throw new Error("Нужен комментарий за что бонус");
  }

  try {
    await sql<any[]>`
      INSERT INTO user_salary_bonus (user_id, amount, reason, created_at)
      VALUES (${userId}, ${amount}, ${reason}, now())
    `;
  } catch (error) {
    console.error("Error adding salary bonus:", error);
    throw new Error("Ошибка при добавлении бонуса");
  }

  await triggerFinanceRecalcForCurrentMonth();
}

export async function deleteUserSalaryBonus(id: number) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql<any[]>`DELETE FROM user_salary_bonus WHERE id = ${id}`;
  } catch (error) {
    console.error("Error deleting salary bonus:", error);
    throw new Error("Ошибка при удалении бонуса");
  }

  await triggerFinanceRecalcForCurrentMonth();
}
