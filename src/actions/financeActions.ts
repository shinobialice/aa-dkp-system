"use server";
import supabase from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { differenceInMonths } from "date-fns";

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
// Функция расчёта бонуса за срок в гильдии
function calculateGuildBonus(joinedAt: string | null): number {
  if (!joinedAt) return 0;
  const now = new Date();
  const joinedDate = new Date(joinedAt);
  const months = differenceInMonths(now, joinedDate);
  if (months < 6) return 0;
  const extraPeriods = Math.floor((months - 6) / 6);
  return 10 + extraPeriods * 5;
}

// Функция получения кастомного бонуса
async function getCustomBonus(userId: number): Promise<number> {
  const { data, error } = await supabase
    .from("user_salary_bonus")
    .select("bonus")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(`Ошибка при получении бонуса для user ${userId}:`, error);
    return 0;
  }

  return data?.bonus ?? 0;
}

export const generateSalaries = async (month: number, year: number) => {
  const { data: fund, error: fundError } = await supabase
    .from("GuildFunds")
    .select("*")
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (fundError || !fund) {
    throw new Error("Сначала нужно сгенерировать фонд");
  }

  const { data: users, error: usersError } = await supabase
    .from("user")
    .select("id, joined_at")
    .eq("active", true)
    .eq("is_eligible_for_salary", true);

  if (usersError || !users || users.length === 0) {
    throw new Error("Нет активных сотрудников для выплаты");
  }

  const baseAmount = Math.floor(fund.salaryBudget / users.length);

  const { error: deleteError } = await supabase
    .from("Salary")
    .delete()
    .eq("month", month)
    .eq("year", year);

  if (deleteError) {
    throw new Error("Ошибка при удалении предыдущих зарплат");
  }

  const salaryRows = await Promise.all(
    users.map(async (user) => {
      const guildBonus = calculateGuildBonus(user.joined_at);
      const customBonus = await getCustomBonus(user.id);
      const totalBonusPercent = guildBonus + customBonus;
      const bonusAmount = Math.round((baseAmount * totalBonusPercent) / 100);
      return {
        year,
        month,
        userId: user.id,
        amount: baseAmount,
        bonus: bonusAmount,
        total: baseAmount + bonusAmount,
      };
    })
  );

  const { error: insertError } = await supabase
    .from("Salary")
    .insert(salaryRows);

  if (insertError) {
    throw new Error("Ошибка при генерации зарплат");
  }
};
