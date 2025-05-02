"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getLoot = async () => {
  return await prisma.loot.findMany({
    include: {
      itemType: true,
    },
    orderBy: {
      acquired_at: "desc",
    },
  });
};

export const sellLootItem = async (lootId: number) => {
  await prisma.loot.update({
    where: { id: lootId },
    data: {
      status: "Продано",
    },
  });
};
