"use server";

import supabase from "@/shared/lib/supabase";

const getUser = async (userId: number) => {
  const { data: user, error } = await supabase
    .from("user")
    .select(
      `
      id,
      username,
      class,
      class_gear_score,
      secondary_class,
      secondary_class_gear_score,
      vk_name,
      active,
      is_eligible_for_salary,
      joined_at
    `,
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Ошибка при получении пользователя:", error);
    throw new Error("Не удалось получить данные пользователя");
  }

  return user;
};

export default getUser;
