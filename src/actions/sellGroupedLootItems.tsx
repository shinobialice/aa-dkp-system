"use server";

import { prisma } from "@/lib/db";

export async function sellGroupedLootItems({
  itemTypeId,
  status,
  quantity,
  soldTo,
  soldToId,
  isFree,
  comment,
  price,
}: {
  itemTypeId: number;
  status: string;
  quantity: number;
  soldTo: string;
  soldToId?: number;
  isFree: boolean;
  comment?: string;
  price?: number;
}) {
  let left = quantity;

  const items = await prisma.loot.findMany({
    where: {
      itemTypeId,
      status,
    },
    orderBy: {
      acquired_at: "asc", 
    },
    include: {
      itemType: true,
    },
  });

  if (items.reduce((sum, i) => sum + (i.quantity ?? 1), 0) < quantity) {
    throw new Error("Недостаточно предметов для продажи");
  }

  for (const item of items) {
    const availableQty = item.quantity ?? 1;
    const takeQty = Math.min(left, availableQty);

    // Обновить или удалить исходную запись
    if (takeQty === availableQty) {
      await prisma.loot.delete({ where: { id: item.id } });
    } else {
      await prisma.loot.update({
        where: { id: item.id },
        data: {
          quantity: availableQty - takeQty,
        },
      });
    }

    // Создать проданную запись
    const created = await prisma.loot.create({
      data: {
        itemTypeId: itemTypeId,
        source: item.source,
        acquired_at: item.acquired_at ?? new Date(),
        quantity: takeQty,
        sold_to: soldTo,
        sold_to_user_id: soldToId,
        sold_at: new Date(),
        comment,
        status: isFree ? "Выдано" : "Продано",
        price: isFree ? 0 : price ?? item.itemType.price ?? 0,
      },
    });

    // Добавить в инвентарь
    if (soldToId) {
      await prisma.userInventory.create({
        data: {
          user_id: soldToId,
          name: item.itemType.name,
          type: isFree ? "Выдано" : "Куплено",
          created_at: new Date(),
          quantity: takeQty,
        },
      });
    }

    left -= takeQty;
    if (left <= 0) break;
  }
}
