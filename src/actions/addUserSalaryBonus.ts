"use server";

import supabase from "@/shared/lib/supabase";

export async function addUserSalaryBonus({
  userId,
  amount,
  reason,
}: {
  userId: number;
  amount: number;
  reason: string;
}) {
  if (amount <= 0) {
    throw new Error("Бонус должен быть больше 0%");
  }
  if (!reason.trim()) {
    throw new Error("Нужен комментарий за что бонус");
  }

  const { error } = await supabase.from("user_salary_bonus").insert([
    {
      user_id: userId,
      amount,
      reason,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error adding salary bonus:", error);
    throw new Error("Ошибка при добавлении бонуса");
  }
}

export async function deleteUserSalaryBonus(id: number) {
  const { error } = await supabase
    .from("user_salary_bonus")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting salary bonus:", error);
    throw new Error("Ошибка при удалении бонуса");
  }
}
