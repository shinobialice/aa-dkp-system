"use server";

import { prisma } from "@/lib/db";

export const removeFromLootQueue = async (id: number) => {
  return prisma.lootQueue.delete({
    where: { id },
  });
};
