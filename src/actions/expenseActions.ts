"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

export const getExpenses = async () => await prisma.expense.findMany({
    orderBy: { date: "desc" },
  });

export const addExpense = async ({
  date,
  amount,
  target,
  source,
  comment,
}: {
  date: string;
  amount: number;
  target: string;
  source: string;
  comment?: string;
}) => {
  await prisma.expense.create({
    data: {
      date: new Date(date),
      amount,
      target,
      source,
      comment,
    },
  });

  revalidatePath("/loot");
};
