"use server";
import sql from "@/shared/lib/db";

export type UserSeal = {
  id: number;
  user_id: number;
  seal_name: string;
  grade: number;
};

const getUserSeals = async (userId: number): Promise<UserSeal[]> => {
  try {
    return await sql<UserSeal[]>`
      SELECT id, user_id, seal_name, grade
      FROM user_seals
      WHERE user_id = ${userId}
      ORDER BY id
    `;
  } catch (error) {
    console.error("Ошибка при получении печатей:", error);
    throw new Error("Не удалось загрузить печати");
  }
};

export default getUserSeals;
