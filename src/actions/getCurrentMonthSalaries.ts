"use server";
import supabase from "@/shared/lib/supabase";

export async function getCurrentMonthSalaries() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data, error } = await supabase
    .from("Salary")
    .select("userId, total")
    .eq("month", month)
    .eq("year", year);

  if (error || !data) {
    console.error("Ошибка при получении зарплат:", error);
    return {};
  }

  const salaries: Record<number, number> = {};
  for (const row of data) {
    salaries[row.userId] = row.total ?? 0;
  }
  return salaries;
}
