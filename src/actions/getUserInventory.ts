"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    },
  });
  return inventory;
};
export default getUserInventory;
