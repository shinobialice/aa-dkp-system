"use server";
import { prisma } from "@/lib/db";

const setItemQuality = async (itemId: number, quality: string) => {
  const updatedItem = await prisma.userInventory.update({
    where: { id: itemId },
    data: { quality },
  });

  return updatedItem;
};

export default setItemQuality;
