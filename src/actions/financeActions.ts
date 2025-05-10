"use server";
import supabase from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type SalaryInsert = Database["public"]["Tables"]["Salary"]["Insert"];


// 1. Get guild funds for a given month/year
export const getGuildFunds = async (month: number, year: number) => {
  const { data, error } = await supabase
    .from("GuildFunds")
    .select("*")
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (error) {
    console.error("Error loading guild funds:", error);
    throw new Error("Ошибка при получении фонда");
  }

  return data;
};

// 2. Get salaries with user info for the month

export const getSalariesForMonth = async (month: number, year: number) => {
  const { data, error } = await supabase
    .from("Salary")
    .select(
      `
    id,
    userId,
    amount,
    bonus,
    total,
    month,
    year,
    user (
      username
    )
  `
    )
    .eq("month", month)
    .eq("year", year);

  if (error || !data) {
    throw new Error("Ошибка при получении зарплат");
  }

  return (data as any[]).map((s) => {
    const username = s.user?.username ?? "Неизвестно";
    return {
      userId: s.userId,
      username: username ?? "Неизвестно",
      amount: s.amount,
      bonus: s.bonus,
      total: s.total,
    };
  });
};

// 3. Generate salaries
export const generateSalaries = async (month: number, year: number) => {
  // Get salary budget
  const { data: fund, error: fundError } = await supabase
    .from("GuildFunds")
    .select("*")
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (fundError || !fund) {
    throw new Error("Сначала нужно сгенерировать фонд");
  }

  // Get eligible users
  const { data: users, error: usersError } = await supabase
    .from("user")
    .select("id, salaryBonus")
    .eq("active", true)
    .eq("is_eligible_for_salary", true);

  if (usersError || !users || users.length === 0) {
    throw new Error("Нет активных сотрудников для выплаты");
  }

  // Calculate base salary
  const baseAmount = Math.floor(fund.salaryBudget / users.length);

  // Delete existing salaries for that month
  const { error: deleteError } = await supabase
    .from("Salary")
    .delete()
    .eq("month", month)
    .eq("year", year);

  if (deleteError) {
    throw new Error("Ошибка при удалении предыдущих зарплат");
  }

  // Insert new salary records
  const salaryRows: SalaryInsert[] = users.map((user) => ({
    year,
    month,
    userId: user.id,
    amount: baseAmount,
    bonus: user.salaryBonus ?? 0,
    total: baseAmount + (user.salaryBonus ?? 0),
  }));
  

  const { error: insertError } = await supabase
    .from("Salary")
    .insert(salaryRows);

  if (insertError) {
    throw new Error("Ошибка при генерации зарплат");
  }
};
