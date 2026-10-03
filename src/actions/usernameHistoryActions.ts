"use server";

import sql from "@/shared/lib/db";
import type { UserUsernameHistoryRow } from "@/shared/lib/dbTypes";

export const getUsernameHistory = async (userId: number) => {
  try {
    return await sql<Omit<UserUsernameHistoryRow, "user_id">[]>`
      SELECT id, old_username, new_username, changed_at
      FROM user_username_history
      WHERE user_id = ${userId}
      ORDER BY changed_at DESC
    `;
  } catch (error) {
    console.error("Ошибка при получении истории ников:", error);
    throw new Error("Не удалось загрузить историю ников");
  }
};
