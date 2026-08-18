"use server";
import sql from "@/shared/lib/db";

const deleteUserTask = async (id: number) => {
  let data;
  try {
    [data] = await sql<any[]>`
      DELETE FROM tasks WHERE id = ${id} RETURNING *
    `;
  } catch {
    throw new Error("Failed to delete task");
  }

  if (!data) {
    throw new Error("Failed to delete task");
  }

  return data;
};

export default deleteUserTask;
