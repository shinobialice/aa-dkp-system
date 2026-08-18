"use server";
import sql from "@/shared/lib/db";

const getTasks = async (userId: number) => {
  try {
    const tasks = await sql<any[]>`
      SELECT id, user_id, name, created_at, completed_at
      FROM tasks
      WHERE user_id = ${userId}
    `;
    return tasks;
  } catch (error) {
    console.error("Ошибка при получении задач:", error);
    throw new Error("Не удалось загрузить задачи");
  }
};

export default getTasks;
