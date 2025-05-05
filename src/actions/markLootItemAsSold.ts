"use server";

import { prisma } from "@/lib/db";

export const markLootItemAsSold = async ({
  lootId,
  soldTo,
  soldToId,
  price,
  comment,
}: {
  lootId: number;
  soldTo: string;
  soldToId?: number;
  price: number;
  comment?: string;
}) => {
  // ⬅️ Сохраняем результат обновления
  const loot = await prisma.loot.update({
    where: { id: lootId },
    data: {
      status: "Продано",
      sold_at: new Date(),
      sold_to: soldTo,
      sold_to_user_id: soldToId ?? null,
      comment,
    },
    include: {
      itemType: true, // ⬅️ это даст loot.itemType
    },
  });

  // ⬅️ Обновляем цену отдельно
  await prisma.itemType.update({
    where: { id: loot.itemTypeId },
    data: {
      price,
    },
  });

  // ⬅️ Добавляем в инвентарь, если покупатель найден
  if (soldToId) {
    await prisma.userInventory.create({
      data: {
        user_id: soldToId,
        name: loot.itemType.name,
        type: "Куплено",
        quantity: loot.quantity ?? 1,
        created_at: new Date(),
      },
    });
  }

  return loot;
};
