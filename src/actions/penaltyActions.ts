"use server";

import sql from "@/shared/lib/db";
import type { UserPenaltyPointsRow } from "@/shared/lib/dbTypes";
import ensurePrivilieges from "./ensurePrivilieges";
import { triggerFinanceRecalcForCurrentMonth } from "@/server/finance/recalc";

export const getUserPenaltyPoints = async (userId: number) => {
  try {
    return await sql<UserPenaltyPointsRow[]>`
      SELECT * FROM user_penalty_points
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
  } catch (error) {
    console.error("Ошибка при получении штрафов:", error);
    throw new Error("Не удалось загрузить штрафы пользователя");
  }
};

export const getUserPenaltyPointsBatch = async (
  userIds: number[],
): Promise<Record<number, number>> => {
  if (userIds.length === 0) return {};

  let data: { user_id: number; total: number }[];
  try {
    data = await sql<{ user_id: number; total: number }[]>`
      SELECT user_id, SUM(amount)::float8 AS total FROM user_penalty_points
      WHERE user_id = ANY(${userIds})
      GROUP BY user_id
    `;
  } catch (error) {
    console.error("Ошибка при получении штрафов:", error);
    throw new Error("Не удалось загрузить штрафы пользователей");
  }

  return Object.fromEntries(data.map((row) => [row.user_id, row.total]));
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
  await ensurePrivilieges(["Администратор"]);
  if (amount <= 0) {
    throw new Error("Штраф должен быть больше 0");
  }
  if (!reason.trim()) {
    throw new Error("Нужен комментарий за что штраф");
  }

  try {
    await sql`
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
  await ensurePrivilieges(["Администратор"]);
  try {
    await sql`
      DELETE FROM user_penalty_points WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Error deleting penalty points:", error);
    throw new Error("Ошибка при удалении штрафа");
  }

  await triggerFinanceRecalcForCurrentMonth();
}
