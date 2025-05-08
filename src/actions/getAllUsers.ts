"use server";

import supabase from "@/lib/supabase";

export const getAllUsersWithInventory = async () => {
  const { data: users, error } = await supabase
    .from("user")
    .select(
      "id, username, class, active, user_inventory(name, type, created_at)"
    );

  if (error || !users) {
    console.error("Ошибка при получении пользователей с инвентарём:", error);
    throw new Error("Не удалось загрузить список пользователей с инвентарем");
  }

  return users;
};
