"use server";
import supabase from "@/lib/supabase";

const editUserTask = async (
  userId: number,
  taskId: number,
  name: string,
  createdAt: Date,
  completedAt: Date | null
) => {
  const { data: updatedTask, error } = await supabase
    .from("tasks")
    .update({
      name,
      created_at: createdAt.toISOString(),
      completed_at: completedAt ? completedAt.toISOString() : null,
    })
    .eq("id", taskId)
    .eq("user_id", userId)
    .select()
    .maybeSingle();

  if (error || !updatedTask) {
    console.error("Failed to update task:", error);
    throw new Error("Ошибка при обновлении задачи");
  }

  return updatedTask;
};

export default editUserTask;
