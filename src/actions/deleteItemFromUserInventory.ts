"use server";
import supabase from "@/shared/lib/supabase";

const deleteItemFromUserInventory = async (id: number) => {
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
