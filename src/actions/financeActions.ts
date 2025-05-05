"use server";
import { prisma } from "@/lib/db";

export const getGuildFunds = async (month: number, year: number) => {
  return await prisma.guildFunds.findFirst({
    where: { month, year },
  });
};

export const getSalariesForMonth = async (month: number, year: number) => {
  const result = await prisma.salary.findMany({
    where: { month, year },
    include: {
      user: true,
    },
  });

  return result.map((s) => ({
    userId: s.userId,
    username: s.user.username,
    amount: s.amount,
    bonus: s.bonus,
    total: s.total,
  }));
};

export const generateSalaries = async (month: number, year: number) => {
  const fund = await prisma.guildFunds.findFirst({ where: { month, year } });
  if (!fund) throw new Error("Сначала нужно сгенерировать фонд");

  const users = await prisma.user.findMany({
    where: {
      active: true,
      is_eligible_for_salary: true,
    },
  });

  if (users.length === 0)
    throw new Error("Нет активных сотрудников для выплаты");

  const baseAmount = Math.floor(fund.salaryBudget / users.length);
  await prisma.salary.deleteMany({
    where: {
      year,
      month,
    },
  });

  for (const user of users) {
    const bonus = user.salaryBonus ?? 0;
    const total = baseAmount + bonus;

    await prisma.salary.create({
      data: {
        year,
        month,
        userId: user.id,
        amount: baseAmount,
        bonus,
        total,
      },
    });
  }
};
