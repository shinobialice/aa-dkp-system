"use server";

import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";

export type ActiveUser = Pick<
  UserRow,
  "id" | "username" | "class" | "active" | "joined_at"
>;

export const getActiveUsers = async () => {
  try {
    return await sql<ActiveUser[]>`
      SELECT id, username, class, active, joined_at FROM "user"
      WHERE active = true
        AND id NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
    `;
  } catch (error) {
    console.error("Ошибка при получении активных игроков:", error);
    throw new Error("Не удалось загрузить список активных пользователей");
  }
};
