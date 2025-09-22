"use server";

import supabase from "@/shared/lib/supabase";

export const getUserSalaryBonus = async (userId: number) => {
  const { data, error } = await supabase
    .from("user_salary_bonus")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка при получении бонусов к зарплате:", error);
    throw new Error("Не удалось загрузить бонусы пользователя");
  }

  return data;
};
