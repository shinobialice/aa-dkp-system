"use server";

import prisma from "@/lib/db";

export async function updateLootItem({
  id,
  quantity,
  source,
  acquired_at,
}: {
  id: number;
  quantity: number;
  source: string;
  acquired_at: Date;
}) {
  try {
    await prisma.loot.update({
      where: { id },
      data: {
        quantity,
        source,
        acquired_at,
      },
    });
  } catch {
    throw new Error("Не удалось обновить предмет");
  }
}
