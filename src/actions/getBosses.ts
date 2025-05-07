"use server";

import prisma from "@/lib/db";

export const getBosses = async () => await prisma.boss.findMany({
    select: {
      id: true,
      boss_name: true,
      dkp_points: true,
      category: true,
    },
  });
