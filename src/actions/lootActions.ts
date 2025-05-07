"use server";

import prisma from "@/lib/db";

export const getItemTypes = async () => await prisma.itemType.findMany({
    select: {
      id: true,
      name: true,
    },
  });

export const getLoot = async () => await prisma.loot.findMany({
    include: {
      itemType: true,
    },
    orderBy: {
      acquired_at: "desc",
    },
  });

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
  const created = await prisma.loot.create({
    data: {
      itemTypeId,
      status: "В наличии",
      source,
      acquired_at: new Date(acquired_at),
      quantity: quantity ?? 1,
    },
  });

  await prisma.loot.update({
    where: { id: created.id },
    data: {},
  });
};

export async function getLootQuantity(lootId: number) {
  const loot = await prisma.loot.findUnique({
    where: { id: lootId },
    select: { quantity: true },
  });

  return loot?.quantity ?? 0;
}
