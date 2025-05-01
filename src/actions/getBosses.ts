"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getBosses = async () => {
  return await prisma.boss.findMany({
    select: {
      id: true,
      boss_name: true,
      dkp_points: true,
      category: true,
    },
  });
};
