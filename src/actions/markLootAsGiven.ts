// src/actions/markLootAsGiven.ts
"use server";

import { prisma } from "@/lib/db";

export const markLootAsGiven = async ({
  userId,
  itemName,
}: {
  userId: number;
  itemName: string;
}) => {
  return prisma.userInventory.create({
    data: {
      user_id: userId,
      name: itemName,
      type: "Выдано", 
      created_at: new Date(),
    },
  });
};
