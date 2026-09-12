"use server";

import sql from "@/shared/lib/db";

export const getActiveUsers = async () => {
  try {
    const users = await sql<any[]>`
      SELECT id, username, class, active, joined_at FROM "user"
      WHERE active = true
        AND id NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
    `;
    return users;
  } catch (error) {
    console.error("Ошибка при получении активных игроков:", error);
    throw new Error("Не удалось загрузить список активных пользователей");
  }
};
