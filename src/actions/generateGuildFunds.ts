"use server";
import { prisma } from "@/lib/db";

export const generateGuildFunds = async (month: number, year: number) => {
  const startDate = new Date(`${year}-${month}-01`);
  const endDate =
    month === 12
      ? new Date(`${year + 1}-01-01`)
      : new Date(`${year}-${month + 1}-01`);

  const loot = await prisma.loot.findMany({
    where: {
      acquired_at: {
        gte: startDate,
        lt: endDate,
      },
      status: "Продано", 
    },
    include: {
      itemType: true,
    },
  });

  const totalIncome = loot.reduce((sum, item) => {
    const price = item.itemType?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const expenses = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: { date: { gte: startDate, lt: endDate } },
  });

  const totalExpenses = expenses._sum.amount ?? 0;
  const profit = totalIncome - totalExpenses;
  const salaryBudget = Math.floor(profit * 0.7);
  const treasuryLeft = profit - salaryBudget;

  // 🧹 Удаляем старый фонд, если есть
  await prisma.guildFunds.deleteMany({ where: { year, month } });

  await prisma.guildFunds.create({
    data: {
      year,
      month,
      totalIncome: Math.round(totalIncome),
      totalExpenses,
      profit,
      salaryBudget,
      treasuryLeft,
    },
  });
};
