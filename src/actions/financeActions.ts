"use server";
import supabase from "@/shared/lib/supabase";
import type { Database } from "@/types/supabase";
import { differenceInMonths } from "date-fns";
import { getUserMonthlyAttendance } from "./getUserMonthlyAttendance";

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
      username,
      class,
      joined_at
    )
  `,
    )
    .eq("month", month)
    .eq("year", year);

  if (error || !data) {
    throw new Error("Ошибка при получении зарплат");
  }

  const classOrder = ['Бард', 'Лук', 'Маг', 'Милик', 'Тактик', 'Танцор', 'Хил'];

  return await Promise.all(
    (data as any[])
      .map(async (s) => {
        const username = s.user?.username ?? "Неизвестно";
        const userClass = s.user?.class ?? "";
        const joinedAt = s.user?.joined_at;
        
        const guildBonus = calculateGuildBonus(joinedAt);
        const customBonus = await getCustomBonus(s.userId);
        const attendance = await getUserMonthlyAttendance(s.userId, year, month);
        const attendancePercent = Math.round(attendance.totalPercent);
        const totalSalaryPercent = guildBonus + customBonus + attendancePercent;
        const bonusPercent = s.bonus ? Math.round((s.bonus / s.amount) * 100) : totalSalaryPercent;
        
        return {
          userId: s.userId,
          username: username ?? "Неизвестно",
          class: userClass,
          amount: s.amount,
          bonus: s.bonus,
          bonusPercent,
          total: s.total,
          guildBonus,
          customBonus,
          attendancePercent,
          totalSalaryPercent,
        };
      })
  ).then(results => 
    results.sort((a, b) => {
      const aIndex = classOrder.indexOf(a.class);
      const bIndex = classOrder.indexOf(b.class);
      const aOrder = aIndex === -1 ? 999 : aIndex;
      const bOrder = bIndex === -1 ? 999 : bIndex;
      return aOrder - bOrder;
    })
  );
};

function calculateGuildBonus(joinedAt: string | null): number {
  if (!joinedAt) return 0;
  const now = new Date();
  const joinedDate = new Date(joinedAt);
  
  // Количество дней с даты вступления
  const diffTime = now.getTime() - joinedDate.getTime();
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Если меньше 6 месяцев (182 дня), то бонус 0%
  if (days < 182) return 0;
  
  let bonus = 0;
  
  // Первая часть: ЕСЛИ(I4>30,5; (I4/30,5)*0,01-0,01; '')
  if (days > 30.5) {
    bonus += (days / 30.5) * 0.01 - 0.01;
  }
  
  // Вторая часть: ЕСЛИ(I4>182; 0,05; '')
  if (days > 182) {
    bonus += 0.05;
  }
  
  // Возвращаем процент (умножаем на 100)
  return Math.round(bonus * 100);
}

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

  const attendanceData = await Promise.all(
    users.map(async (user) => {
      const attendance = await getUserMonthlyAttendance(user.id, year, month);
      return { userId: user.id, dkp: attendance.dkp };
    }),
  );

  const totalDKP = attendanceData.reduce((sum, user) => sum + user.dkp, 0);

  if (totalDKP === 0) {
    throw new Error("Нет данных DKP за указанный месяц");
  }

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
      const userDKP =
        attendanceData.find((data) => data.userId === user.id)?.dkp || 0;
      const baseAmount = Math.round((userDKP / totalDKP) * fund.salaryBudget);

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
    }),
  );

  const { error: insertError } = await supabase
    .from("Salary")
    .insert(salaryRows);

  if (insertError) {
    throw new Error("Ошибка при генерации зарплат");
  }
};
