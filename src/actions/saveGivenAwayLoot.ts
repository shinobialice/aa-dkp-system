"use server";

import { prisma } from "@/lib/db";

export const saveGivenAwayLoot = async (
  userId: number,
  item: { name: string; date: string; comment?: string; status: string }
) => {
  const dateObj = new Date(item.date);

  // ⏫ Используем upsert, чтобы не было дублей
  await prisma.givenAwayLoot.upsert({
    where: {
      user_id_name: {
        user_id: userId,
        name: item.name,
      },
    },
    update: {
      date: dateObj,
      comment: item.comment,
      status: item.status,
    },
    create: {
      user_id: userId,
      name: item.name,
      date: dateObj,
      comment: item.comment,
      status: item.status,
    },
  });

  if (item.status === "Выдано") {
    // Убедимся, что в инвентаре нет дубликата
    const exists = await prisma.userInventory.findFirst({
      where: {
        user_id: userId,
        name: item.name,
        type: "Выдано",
      },
    });

    if (!exists) {
      await prisma.userInventory.create({
        data: {
          user_id: userId,
          name: item.name,
          type: "Выдано",
          created_at: dateObj,
        },
      });
    }
  } else {
    // Если статус "В наличии" — удалим из инвентаря
    await prisma.userInventory.deleteMany({
      where: {
        user_id: userId,
        name: item.name,
        type: "Выдано",
      },
    });
  }
};
