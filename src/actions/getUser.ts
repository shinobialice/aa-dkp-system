"use server";

import sql from "@/shared/lib/db";

const getUser = async (userId: number) => {
  try {
    const [user] = await sql<any[]>`
      SELECT
        id,
        username,
        class,
        class_gear_score,
        secondary_class,
        secondary_class_gear_score,
        vk_name,
        active,
        is_eligible_for_salary,
        probation_bypass,
        joined_at,
        avatar_url
      FROM "user"
      WHERE id = ${userId}
    `;
    return user ?? null;
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    throw new Error("Не удалось получить данные пользователя");
  }
};

export default getUser;
