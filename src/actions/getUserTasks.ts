"use server";
import supabase from "@/shared/lib/supabase";

const getUserTasks = async (userId: number) => {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("id, user_id, name, created_at, completed_at")
    .eq("user_id", userId);

  if (error) {
    console.error("Ошибка при получении задач пользователя:", error);
    throw new Error("Не удалось загрузить задачи");
  }

  return tasks;
};

export default getUserTasks;
