"use server";
import sql from "@/shared/lib/db";

const createUserTask = async (
  userId: number,
  name: string,
  createdAt: Date,
  completedAt: Date | null,
) => {
  let task;
  try {
    [task] = await sql<any[]>`
      INSERT INTO tasks (user_id, name, created_at, completed_at)
      VALUES (
        ${userId},
        ${name},
        ${createdAt.toISOString()},
        ${completedAt ? completedAt.toISOString() : null}
      )
      RETURNING *
    `;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Ошибка при создании задачи");
  }

  if (!task) {
    console.error("Error creating task: not returned");
    throw new Error("Ошибка при создании задачи");
  }

  return task;
};

export default createUserTask;
