"use server";

import { prisma } from "@/lib/db";

export const markQueueLootAsSold = async ({
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
      type: "Куплено",
      quantity: delivered > 0 ? delivered : 1,
      created_at: new Date(),
    },
  });
};
