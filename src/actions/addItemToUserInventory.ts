"use server";
import supabase from "@/lib/supabase";

const addItemToUserInventory = async (
  userId: number,
  name: string,
  type: string,
  quality: string | null
) => {
  const { data, error } = await supabase
    .from("user_inventory")
    .insert([
      {
        user_id: userId,
        name,
        type,
        quality,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .maybeSingle();

  if (error) {
    console.error("Failed to insert inventory item:", error);
    throw new Error("Error inserting inventory item");
  }

  return data;
};

export default addItemToUserInventory;
