"use server";

import supabase from "@/lib/supabase";

export const markLootAsGiven = async ({
  userId,
  itemName,
}: {
  userId: number;
  itemName: string;
}) => {
  const { data, error } = await supabase
    .from("user_inventory")
    .insert([
      {
        user_id: userId,
        name: itemName,
        type: "Выдано",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .maybeSingle();

  if (error) {
    console.error("Ошибка при сохранении выданного лута:", error);
    throw new Error("Не удалось выдать предмет");
  }

  return data;
};
