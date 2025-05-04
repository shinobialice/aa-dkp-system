"use server";

import { prisma } from "@/lib/db";

export const markLootAsSold = async ({
  lootQueueId,
  userId,
  itemName,
  delivered,
}: {
  lootQueueId: number;
  userId: number;
  itemName: string;
  delivered: number;
}) => {
  await prisma.lootQueue.delete({
    where: { id: lootQueueId },
  });

  return prisma.userInventory.create({
    data: {
      user_id: userId,
      name: itemName,
      type: "Лут",
      quantity: delivered > 0 ? delivered : 1,
      created_at: new Date(),
    },
  });
};
