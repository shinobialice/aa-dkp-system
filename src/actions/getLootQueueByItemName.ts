"use server";

import prisma from "@/lib/db";

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

  if (!item) {return [];}

  return item.lootQueue.map((entry) => ({
    id: entry.id,
    userId: entry.userId,
    username: entry.user.username,
    status: entry.status,
    synth_target: entry.synth_target,
    required: entry.required ?? 0,
    delivered: entry.delivered ?? 0,
    createdAt: entry.created_at,
  }));
};
