"use server";
import supabase from "@/shared/lib/supabase";
import type { Database } from "@/types/supabase";
import { getUserMonthlyAttendance } from "./getUserMonthlyAttendance";
import { getUserTags } from "./userTagsActions";
import { getUserPenaltyPoints } from "./penaltyActions";
import calculateSalaryWeight from "@/utils/calculateSalaryWeight";
import calculateGuildTenureBonus from "@/utils/calculateGuildTenureBonus";

type SalaryInsert = Database["public"]["Tables"]["Salary"]["Insert"];

export const getGuildFunds = async (month: number, year: number) => {
  const { data, error } = await supabase
    .from("GuildFunds")
    .select("*")
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (error) {
    throw new Error("Ошибка при получении фонда");
  }

  return data;
};

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
  `,
    )
    .eq("month", month)
    .eq("year", year);

  if (error || !data) {
    throw new Error("Ошибка при получении зарплат");
  }

  return (data as any[]).map((s) => {
    const username = s.user?.username ?? "Неизвестно";
    const bonusPercent = s.amount ? Math.round((s.bonus / s.amount) * 100) : 0;
    return {
      userId: s.userId,
      username: username ?? "Неизвестно",
      amount: s.amount,
      bonus: s.bonus,
      bonusPercent,
      total: s.total,
    };
  });
};

async function getCustomBonus(userId: number): Promise<number> {
  const { data, error } = await supabase
    .from("user_salary_bonus")
    .select("amount")
    .eq("user_id", userId);

  if (error) {
    return 0;
  }

  const totalBonus =
    data?.reduce((sum, bonus) => sum + (bonus.amount || 0), 0) ?? 0;
  return totalBonus;
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

  const userRows = await Promise.all(
    users.map(async (user) => {
      const [attendance, tagRows, penaltyRows, individualBonusPercent] =
        await Promise.all([
          getUserMonthlyAttendance(user.id, year, month),
          getUserTags(user.id),
          getUserPenaltyPoints(user.id),
          getCustomBonus(user.id),
        ]);

      const tags = (tagRows ?? []).map((t) => t.tag);
      const penaltyPoints = (penaltyRows ?? []).reduce(
        (sum, p) => sum + (p.amount || 0),
        0,
      );
      const tenureBonusPercent = calculateGuildTenureBonus(user.joined_at);

      const weightResult = calculateSalaryWeight({
        active: true,
        isEligibleForSalary: true,
        joinedAt: user.joined_at,
        tags,
        primePercent: attendance.primePercent,
        totalPercent: attendance.totalPercent,
        basePoints: attendance.dkp,
        tenureBonusPercent,
        individualBonusPercent,
        penaltyPoints,
      });

      return {
        userId: user.id,
        basePoints: attendance.dkp,
        ...weightResult,
      };
    }),
  );

  const eligibleRows = userRows.filter((r) => r.eligible);
  const totalWeight = eligibleRows.reduce((sum, r) => sum + r.finalWeight, 0);
  const totalBasePoints = eligibleRows.reduce(
    (sum, r) => sum + r.basePoints,
    0,
  );

  if (totalWeight === 0) {
    throw new Error(
      "Нет допущенных пользователей с ненулевым весом за указанный месяц",
    );
  }

  const { error: deleteError } = await supabase
    .from("Salary")
    .delete()
    .eq("month", month)
    .eq("year", year);

  if (deleteError) {
    throw new Error("Ошибка при удалении предыдущих зарплат");
  }

  const salaryRows = userRows.map((r) => {
    if (!r.eligible) {
      return { year, month, userId: r.userId, amount: 0, bonus: 0, total: 0 };
    }

    // amount — базовая доля фонда без учёта бонусов/штрафов (для сравнения в UI),
    // total — фактическая выплата по итоговому весу (basePoints с бонусами и штрафом).
    const amount = totalBasePoints
      ? Math.round((r.basePoints / totalBasePoints) * fund.salaryBudget)
      : 0;
    const total = Math.round((r.finalWeight / totalWeight) * fund.salaryBudget);

    return {
      year,
      month,
      userId: r.userId,
      amount,
      bonus: total - amount,
      total,
    };
  });

  const { error: insertError } = await supabase
    .from("Salary")
    .insert(salaryRows);

  if (insertError) {
    throw new Error("Ошибка при генерации зарплат");
  }
};
