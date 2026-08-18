"use server";
import sql from "@/shared/lib/db";

const editUserTask = async (
  userId: number,
  taskId: number,
  name: string,
  createdAt: Date,
  completedAt: Date | null,
) => {
  let updatedTask;
  try {
    [updatedTask] = await sql<any[]>`
      UPDATE tasks SET
        name = ${name},
        created_at = ${createdAt.toISOString()},
        completed_at = ${completedAt ? completedAt.toISOString() : null}
      WHERE id = ${taskId} AND user_id = ${userId}
      RETURNING *
    `;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw new Error("Ошибка при обновлении задачи");
  }

  if (!updatedTask) {
    console.error("Failed to update task: not found");
    throw new Error("Ошибка при обновлении задачи");
  }

  return updatedTask;
};

export default editUserTask;
