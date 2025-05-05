"use server";

import { prisma } from "@/lib/db";

export async function distributeLootItem({
  lootId,
  quantity,
  soldTo,
  soldToId,
  isFree,
  comment,
  price,
}: {
  lootId: number;
  quantity: number;
  soldTo: string;
  soldToId?: number;
  isFree: boolean;
  comment?: string;
  price?: number;
}) {
  const loot = await prisma.loot.findUnique({
    where: { id: lootId },
    include: { itemType: true },
  });

  if (!loot || !loot.quantity || loot.quantity < quantity) {
    throw new Error("Недостаточно предметов для выдачи");
  }

  const remainingQuantity = loot.quantity - quantity;

  await prisma.loot.update({
    where: { id: lootId },
    data: {
      quantity: remainingQuantity,
      status: remainingQuantity === 0 ? "Продано" : "В наличии",
    },
  });

  const created = await prisma.loot.create({
    data: {
      itemTypeId: loot.itemTypeId,
      source: loot.source,
      acquired_at: loot.acquired_at ?? new Date(),
      quantity,
      sold_to: soldTo,
      sold_to_user_id: soldToId,
      sold_at: new Date(),
      comment,
      status: isFree ? "Выдано" : "Продано",
      price: isFree ? 0 : price ?? loot.itemType?.price ?? 0,
    },
  });

  await prisma.loot.update({
    where: { id: created.id },
    data: {
    },
  });

  if (soldToId) {
    await prisma.userInventory.create({
      data: {
        user_id: soldToId,
        name: loot.itemType.name,
        type: isFree ? "Выдано" : "Куплено",
        created_at: new Date(),
        quantity,
      },
    });
  }
}
