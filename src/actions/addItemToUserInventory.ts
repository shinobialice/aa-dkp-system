"use server";
import supabase from "@/lib/supabase";
import ensurePrivilieges from "./ensurePrivilieges";

const addItemToUserInventory = async (
  userId: number,
  name: string,
  type: string,
  quality: string | null
) => {
  await ensurePrivilieges(["Администратор"]);
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
