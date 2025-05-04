"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const markLootAsSold = async ({
  lootQueueId,
  userId,
  itemName,
}: {
  lootQueueId: number;
  userId: number;
  itemName: string;
}) => {
  // Удалить из очереди
  await prisma.lootQueue.delete({
    where: { id: lootQueueId },
  });

  // Добавить в инвентарь
  return prisma.userInventory.create({
    data: {
      user_id: userId,
      name: itemName,
      type: "Лут",
      created_at: new Date(),
    },
  });
};
