"use server";
import supabase from "@/shared/lib/supabase";

const deleteUserTask = async (id: number) => {
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
