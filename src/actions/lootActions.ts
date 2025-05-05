"use server";

import { prisma } from "@/lib/db";

export const getItemTypes = async () => {
  return await prisma.itemType.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

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

export const addLootItem = async ({
  itemTypeId,
  source,
  acquired_at,
  quantity,
}: {
  itemTypeId: number;
  source?: string;
  acquired_at: string;
  quantity?: number;
}) => {
  await prisma.loot.create({
    data: {
      itemTypeId,
      status: "В наличии",
      source,
      acquired_at: new Date(acquired_at),
      quantity: quantity ?? 1,
    },
  });
};
