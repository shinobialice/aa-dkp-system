"use server";

import { prisma } from "@/lib/db";

export const getUserSalaryBonus = async (userId: number) => {
  return await prisma.userSalaryBonus.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc", 
    },
  });
};
