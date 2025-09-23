"use server";

import supabase from "@/shared/lib/supabase";

export const getActiveUsers = async () => {
  const { data: users, error } = await supabase
    .from("user")
    .select("id, username, class, active")
    .eq("active", true);

  if (error || !users) {
    console.error("Ошибка при получении активных игроков:", error);
    throw new Error("Не удалось загрузить список активных пользователей");
  }

  return users;
};
