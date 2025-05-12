"use server";

import supabase from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createUser(username: string) {
  const { data, error } = await supabase
    .from("user")
    .insert({
      username,
      active: true,
      created_at: new Date().toISOString(),
      is_eligible_for_salary: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Ошибка создания пользователя:", error);
    throw new Error("Не удалось создать пользователя");
  }

  revalidatePath("/settings"); // или нужный путь
  return data;
}
