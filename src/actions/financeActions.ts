"use server";
import supabase from "@/lib/supabase";

// 1. Get guild funds for a given month/year
export const getGuildFunds = async (month: number, year: number) => {
  const { data, error } = await supabase
    .from("guild_funds")
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
    .from("salary")
    .select("user_id, amount, bonus, total, user(username)")
    .eq("month", month)
    .eq("year", year);

  if (error || !data) {
    console.error("Error fetching salaries:", error);
    throw new Error("Ошибка при получении зарплат");
  }

  return data.map((s) => ({
    userId: s.user_id,
    username: s.user?.username,
    amount: s.amount,
    bonus: s.bonus,
    total: s.total,
  }));
};

// 3. Generate salaries
export const generateSalaries = async (month: number, year: number) => {
  // Get salary budget
  const { data: fund, error: fundError } = await supabase
    .from("guild_funds")
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
    .select("id, salary_bonus")
    .eq("active", true)
    .eq("is_eligible_for_salary", true);

  if (usersError || !users || users.length === 0) {
    throw new Error("Нет активных сотрудников для выплаты");
  }

  // Calculate base salary
  const baseAmount = Math.floor(fund.salary_budget / users.length);

  // Delete existing salaries for that month
  const { error: deleteError } = await supabase
    .from("salary")
    .delete()
    .eq("month", month)
    .eq("year", year);

  if (deleteError) {
    throw new Error("Ошибка при удалении предыдущих зарплат");
  }

  // Insert new salary records
  const salaryRows = users.map((user) => {
    const bonus = user.salary_bonus ?? 0;
    const total = baseAmount + bonus;

    return {
      year,
      month,
      user_id: user.id,
      amount: baseAmount,
      bonus,
      total,
    };
  });

  const { error: insertError } = await supabase
    .from("salary")
    .insert(salaryRows);

  if (insertError) {
    throw new Error("Ошибка при генерации зарплат");
  }
};
