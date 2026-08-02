"use server";
import supabase from "@/shared/lib/supabaseAdmin";

export async function getUserCurrentMonthSalary(userId: number) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data, error } = await supabase
    .from("Salary")
    .select("total")
    .eq("userId", userId)
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (error) {
    console.error("Ошибка при получении зарплаты:", error);
    return null;
  }

  return data?.total ?? null;
}
