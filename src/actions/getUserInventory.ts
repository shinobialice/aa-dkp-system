"use server";
import { prisma } from "@/lib/db";

const getUserInventory = async (userId: number) => {
  const inventory = await prisma.userInventory.findMany({
    where: { user_id: Number(userId) },
    select: {
      id: true,
      user_id: true,
      type: true,
      name: true,
      quality: true,
      created_at: true,
      quantity: true,
    },
  });
  return inventory;
};
export default getUserInventory;
