"use server";
import supabase from "@/lib/supabase";

const getUserInventory = async (userId: number) => {
  const { data: inventory, error } = await supabase
    .from("user_inventory")
    .select(`
      id,
      user_id,
      type,
      name,
      quality,
      created_at,
      quantity
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Ошибка при получении инвентаря пользователя:", error);
    throw new Error("Не удалось получить инвентарь");
  }

  return inventory;
};

export default getUserInventory;
