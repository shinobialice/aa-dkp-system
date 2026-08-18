"use server";

import sql from "@/shared/lib/db";

export const getUsernameHistory = async (userId: number) => {
  try {
    const data = await sql<any[]>`
      SELECT id, old_username, new_username, changed_at
      FROM user_username_history
      WHERE user_id = ${userId}
      ORDER BY changed_at DESC
    `;
    return data ?? [];
  } catch (error) {
    console.error("Ошибка при получении истории ников:", error);
    throw new Error("Не удалось загрузить историю ников");
  }
};
