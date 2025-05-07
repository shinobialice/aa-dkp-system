"use server";

import prisma from "@/lib/db";

export const markLootItemAsSold = async ({
  lootId,
  soldTo,
  soldToId,
  price,
  comment,
  quantity,
  isFree = false,
}: {
  lootId: number;
  soldTo: string;
  soldToId?: number;
  price: number;
  comment?: string;
  quantity: number;
  isFree?: boolean;
}) => {
  const loot = await prisma.loot.findUnique({
    where: { id: lootId },
    include: { itemType: true },
  });

  if (!loot) {throw new Error("Лут не найден");}

  if (quantity > loot.quantity) {
    throw new Error(
      `Нельзя продать ${quantity} шт — в наличии только ${loot.quantity}`
    );
  }

  const remainingQuantity = loot.quantity - quantity;

  await prisma.loot.update({
    where: { id: lootId },
    data: {
      quantity: remainingQuantity,
      status: remainingQuantity === 0 ? "Продано" : "В наличии",
    },
  });

  await prisma.loot.create({
    data: {
      itemTypeId: loot.itemTypeId,
      source: loot.source,
      acquired_at: new Date().toISOString(),
      quantity,
      status: isFree ? "Выдано" : "Продано",
      price: isFree ? 0 : price,
      sold_at: new Date(),
      sold_to: soldTo,
      sold_to_user_id: soldToId ?? null,
      comment,
    },
  });

  if (soldToId) {
    await prisma.userInventory.create({
      data: {
        user_id: soldToId,
        name: loot.itemType.name,
        type: isFree ? "Выдано" : "Куплено",
        quantity,
        created_at: new Date(),
      },
    });
  }
};
