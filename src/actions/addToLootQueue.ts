"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToLootQueue = async (username: string, itemName: string) => {
  const user = await prisma.user.findUnique({ where: { username } });
  const item = await prisma.itemType.findUnique({ where: { name: itemName } });

  if (!user || !item) {
    throw new Error("User or item not found");
  }

  return prisma.lootQueue.create({
    data: {
      userId: user.id,
      itemTypeId: item.id,
      status: "ожидание",
      remaining: item.price ?? 0,
    },
  });
};
