"use server";

import sql from "@/shared/lib/db";
import { triggerFinanceRecalcForCurrentMonth } from "./recalculateFinanceForMonth";

export const getUserPenaltyPoints = async (userId: number) => {
  try {
    const data = await sql<any[]>`
      SELECT * FROM user_penalty_points
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return data;
  } catch (error) {
    console.error("Ошибка при получении штрафов:", error);
    throw new Error("Не удалось загрузить штрафы пользователя");
  }
};

// Батч-версия getUserPenaltyPoints — суммирует штрафы сразу для всех
// переданных пользователей одним запросом (используется при расчёте причин
// отказа в ЗП для всей гильдии на странице /members).
export const getUserPenaltyPointsBatch = async (
  userIds: number[],
): Promise<Record<number, number>> => {
  if (userIds.length === 0) return {};

  let data;
  try {
    data = await sql<any[]>`
      SELECT user_id, amount FROM user_penalty_points
      WHERE user_id = ANY(${userIds})
    `;
  } catch (error) {
    console.error("Ошибка при получении штрафов:", error);
    throw new Error("Не удалось загрузить штрафы пользователей");
  }

  const result: Record<number, number> = {};
  for (const row of data ?? []) {
    result[row.user_id] = (result[row.user_id] ?? 0) + (row.amount ?? 0);
  }
  return result;
};

export async function addUserPenaltyPoints({
  userId,
  amount,
  reason,
}: {
  userId: number;
  amount: number;
  reason: string;
}) {
  if (amount <= 0) {
    throw new Error("Штраф должен быть больше 0");
  }
  if (!reason.trim()) {
    throw new Error("Нужен комментарий за что штраф");
  }

  try {
    await sql<any[]>`
      INSERT INTO user_penalty_points (user_id, amount, reason, created_at)
      VALUES (${userId}, ${amount}, ${reason}, now())
    `;
  } catch (error) {
    console.error("Error adding penalty points:", error);
    throw new Error("Ошибка при добавлении штрафа");
  }

  await triggerFinanceRecalcForCurrentMonth();
}

export async function deleteUserPenaltyPoints(id: number) {
  try {
    await sql<any[]>`
      DELETE FROM user_penalty_points WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Error deleting penalty points:", error);
    throw new Error("Ошибка при удалении штрафа");
  }

  await triggerFinanceRecalcForCurrentMonth();
}
