"use server";

import sql from "@/shared/lib/db";

export async function getEligibleUsers() {
  try {
    return await sql<any[]>`
      SELECT id, username FROM "user"
      WHERE active = true AND google_id IS NULL AND vk_id IS NULL AND mail_id IS NULL
      ORDER BY username ASC
    `;
  } catch (error) {
    console.error("Ошибка при получении eligible пользователей:", error);
    throw new Error("Не удалось загрузить пользователей");
  }
}
