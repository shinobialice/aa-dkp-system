"use server";

import supabase from "@/shared/lib/supabaseAdmin";

export const getUsernameHistory = async (userId: number) => {
  const { data, error } = await supabase
    .from("user_username_history")
    .select("id, old_username, new_username, changed_at")
    .eq("user_id", userId)
    .order("changed_at", { ascending: false });

  if (error) {
    console.error("Ошибка при получении истории ников:", error);
    throw new Error("Не удалось загрузить историю ников");
  }

  return data ?? [];
};
