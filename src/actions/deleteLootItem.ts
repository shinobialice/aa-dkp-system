// src/actions/deleteLootItem.ts
"use server";
import { prisma } from "@/lib/db";

export async function deleteLootItem(id: number) {
  await prisma.loot.delete({
    where: { id },
  });
}
