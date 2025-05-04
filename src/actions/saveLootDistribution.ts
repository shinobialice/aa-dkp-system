"use server";

import { prisma } from "@/lib/db";

type LootItem = {
  name: string;
  date: string;
  comment?: string;
};

type Player = {
  id: number; // 👈 используем ID
  loot: LootItem[];
};

export async function saveLootDistribution(players: Player[]) {
  for (const player of players) {
    const user = await prisma.user.findUnique({
      where: { id: player.id },
    });
    if (!user) continue;

    for (const loot of player.loot) {
      if (!loot.date) continue;

      const itemName = loot.comment || loot.name;

      const itemType = await prisma.itemType.findUnique({
        where: { name: itemName },
      });

      if (!itemType) {
        console.warn(`Предмет '${itemName}' не найден в item_type — пропущен`);
        continue;
      }

      // Удаляем предыдущую выдачу, если она уже была
      await prisma.userInventory.deleteMany({
        where: {
          user_id: user.id,
          name: itemName,
        },
      });

      // Добавляем в инвентарь
      await prisma.userInventory.create({
        data: {
          user_id: user.id,
          name: itemName,
          type: "Раздача лута",
          created_at: new Date(loot.date),
        },
      });
    }
  }

  return { success: true };
}
