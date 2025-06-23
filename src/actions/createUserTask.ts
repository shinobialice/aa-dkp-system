"use server";
import supabase from "@/lib/supabase";
import ensurePrivilieges from "./ensurePrivilieges";

const createUserTask = async (
  userId: number,
  name: string,
  createdAt: Date,
  completedAt: Date | null
) => {
  await ensurePrivilieges(["Администратор"]);
  const { data: task, error } = await supabase
    .from("tasks")
    .insert([
      {
        user_id: userId,
        name,
        created_at: createdAt.toISOString(),
        completed_at: completedAt ? completedAt.toISOString() : null,
      },
    ])
    .select()
    .maybeSingle();

  if (error || !task) {
    console.error("Error creating task:", error);
    throw new Error("Ошибка при создании задачи");
  }

  return task;
};

export default createUserTask;
