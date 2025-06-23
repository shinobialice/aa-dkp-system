"use server";
import supabase from "@/lib/supabase";
import ensurePrivilieges from "./ensurePrivilieges";

const deleteItemFromUserInventory = async (id: number) => {
  await ensurePrivilieges(["Администратор"]);
  const { data, error } = await supabase
    .from("user_inventory")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    throw new Error("Failed to delete item from user inventory");
  }

  return data;
};

export default deleteItemFromUserInventory;
