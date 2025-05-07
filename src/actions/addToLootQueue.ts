"use server";

import prisma from "@/lib/db";

export const addToLootQueue = async (username: string, itemName: string) => {
  const user = await prisma.user.findFirst({ where: { username } });
  const item = await prisma.itemType.findUnique({ where: { name: itemName } });

  if (!user || !item) {
    throw new Error("User or item not found");
  }

  return prisma.lootQueue.create({
    data: {
      userId: user.id,
      itemTypeId: item.id,
      status: "ожидание",
      required: 1,
      delivered: 0,
      synth_target: "",
    },
  });
};
