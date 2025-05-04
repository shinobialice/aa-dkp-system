"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getLootQueueByItemName = async (itemName: string) => {
  const item = await prisma.itemType.findUnique({
    where: { name: itemName },
    include: {
      lootQueue: {
        include: {
          user: true,
        },
        orderBy: { created_at: "asc" },
      },
    },
  });

  if (!item) return [];

  return item.lootQueue.map((entry) => ({
    id: entry.id,
    userId: entry.userId,
    username: entry.user.username,
    status: entry.status,
    synthTarget: entry.synthTarget,
    required: item.price ?? 0,
    delivered: item.price && entry.remaining ? item.price - entry.remaining : 0,
    createdAt: entry.created_at,
  }));
};
