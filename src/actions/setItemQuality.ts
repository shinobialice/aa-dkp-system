"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const setItemQuality = async (itemId: number, quality: string) => {
  const updatedItem = await prisma.userInventory.update({
    where: { id: itemId },
    data: { quality },
  });

  return updatedItem;
};

export default setItemQuality;
