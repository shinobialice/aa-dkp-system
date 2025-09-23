"use server";

import supabase from "@/shared/lib/supabase";

export async function updateUser(
  id: number,
  data: Partial<{ active: boolean; is_eligible_for_salary: boolean }>,
) {
  const { data: updatedUser, error } = await supabase
    .from("user")
    .update(data)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !updatedUser) {
    console.error("Ошибка при обновлении пользователя:", error);
    throw new Error("Не удалось обновить пользователя");
  }

  return updatedUser;
}
