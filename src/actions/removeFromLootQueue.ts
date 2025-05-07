"use server";

import prisma from "@/lib/db";

export const removeFromLootQueue = async (id: number) => prisma.lootQueue.delete({
    where: { id },
  });
