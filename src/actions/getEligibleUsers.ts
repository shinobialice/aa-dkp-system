"use server";

import supabase from "@/shared/lib/supabase";

export async function getEligibleUsers() {
  const { data: users, error } = await supabase
    .from("user")
    .select("id, username")
    .eq("active", true)
    .is("google_id", null)
    .order("username", { ascending: true });

  if (error || !users) {
    console.error("Ошибка при получении eligible пользователей:", error);
    throw new Error("Не удалось загрузить пользователей");
  }

  return users;
}
