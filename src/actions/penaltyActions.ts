"use server";

import supabase from "@/shared/lib/supabase";

export const getUserPenaltyPoints = async (userId: number) => {
  const { data, error } = await supabase
    .from("user_penalty_points")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка при получении штрафов:", error);
    throw new Error("Не удалось загрузить штрафы пользователя");
  }

  return data;
};

export async function addUserPenaltyPoints({
  userId,
  amount,
  reason,
}: {
  userId: number;
  amount: number;
  reason: string;
}) {
  if (amount <= 0) {
    throw new Error("Штраф должен быть больше 0");
  }
  if (!reason.trim()) {
    throw new Error("Нужен комментарий за что штраф");
  }

  const { error } = await supabase.from("user_penalty_points").insert([
    {
      user_id: userId,
      amount,
      reason,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error adding penalty points:", error);
    throw new Error("Ошибка при добавлении штрафа");
  }
}

export async function deleteUserPenaltyPoints(id: number) {
  const { error } = await supabase
    .from("user_penalty_points")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting penalty points:", error);
    throw new Error("Ошибка при удалении штрафа");
  }
}
