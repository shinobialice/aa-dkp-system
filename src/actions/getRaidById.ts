"use server";

import prisma from "@/lib/db";

export const getRaidById = async (id: string) => {
  const raid = await prisma.raid.findUnique({
    where: { id: parseInt(id) },
    include: {
      raidBosses: {
        include: {
          boss: true,
        },
      },
      attendance: {
        include: {
          user: true,
        },
      },
    },
  });

  return raid;
};
