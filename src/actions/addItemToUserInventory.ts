"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addItemToUserInventory = async (
  userId: number,
  name: string,
  type: string,
  quality: string | null
) => {
  const newInventoryItem = await prisma.userInventory.create({
    data: {
      user_id: userId,
      name,
      type,
      quality: quality || null,
      created_at: new Date(), // обязательно добавляем дату
    },
  });
  return newInventoryItem;
};
export default addItemToUserInventory;
