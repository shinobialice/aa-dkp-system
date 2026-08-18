"use server";

import sql from "@/shared/lib/db";

export const getUserSalaryBonus = async (userId: number) => {
  try {
    return await sql<any[]>`
      SELECT * FROM user_salary_bonus
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
  } catch (error) {
    console.error("Ошибка при получении бонусов к зарплате:", error);
    throw new Error("Не удалось загрузить бонусы пользователя");
  }
};
