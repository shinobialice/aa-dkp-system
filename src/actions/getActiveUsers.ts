"use server";

import sql from "@/shared/lib/db";

export const getActiveUsers = async () => {
  try {
    const users = await sql<any[]>`
      SELECT id, username, class, active FROM "user" WHERE active = true
    `;
    return users;
  } catch (error) {
    console.error("Ошибка при получении активных игроков:", error);
    throw new Error("Не удалось загрузить список активных пользователей");
  }
};
