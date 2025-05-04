"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const removeFromLootQueue = async (id: number) => {
  return prisma.lootQueue.delete({
    where: { id },
  });
};
