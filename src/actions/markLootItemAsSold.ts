"use server";

import { prisma } from "@/lib/db";

export const markLootItemAsSold = async ({
  lootId,
  soldTo,
  soldToId,
  price,
  comment,
  quantity,
}: {
  lootId: number;
  soldTo: string;
  soldToId?: number;
  price: number;
  comment?: string;
  quantity: number;
}) => {
  const loot = await prisma.loot.findUnique({
    where: { id: lootId },
    include: { itemType: true },
  });

  if (!loot) throw new Error("Лут не найден");

  if (quantity > loot.quantity) {
    throw new Error(
      `Нельзя продать ${quantity} шт — в наличии только ${loot.quantity}`
    );
  }

  // Обновим цену
  await prisma.itemType.update({
    where: { id: loot.itemTypeId },
    data: { price },
  });

  if (quantity === loot.quantity) {
    // продаём всё — статус "Продано"
    await prisma.loot.update({
      where: { id: lootId },
      data: {
        status: "Продано",
        sold_at: new Date(),
        sold_to: soldTo,
        sold_to_user_id: soldToId ?? null,
        comment,
      },
    });
  } else {
    // продаём часть — просто уменьшаем количество
    await prisma.loot.update({
      where: { id: lootId },
      data: {
        quantity: loot.quantity - quantity,
      },
    });
  }

  // Добавим в инвентарь, если пользователь есть
  if (soldToId) {
    await prisma.userInventory.create({
      data: {
        user_id: soldToId,
        name: loot.itemType.name,
        type: "Куплено",
        quantity,
        created_at: new Date(),
      },
    });
  }
};
