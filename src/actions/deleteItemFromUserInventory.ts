"use server";
import supabase from "@/shared/lib/supabaseAdmin";
import ensureCanEditUserData from "./ensureCanEditUserData";

const deleteItemFromUserInventory = async (id: number) => {
  const { data: item } = await supabase
    .from("user_inventory")
    .select("user_id")
    .eq("id", id)
    .maybeSingle();

  if (!item) {
    throw new Error("Failed to delete item from user inventory");
  }

  await ensureCanEditUserData(item.user_id, "inventoryEditEnabled");

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
