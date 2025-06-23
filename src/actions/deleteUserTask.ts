"use server";
import supabase from "@/lib/supabase";
import ensurePrivilieges from "./ensurePrivilieges";

const deleteUserTask = async (id: number) => {
  await ensurePrivilieges(["Администратор"]);
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    throw new Error("Failed to delete task");
  }

  return data;
};

export default deleteUserTask;
