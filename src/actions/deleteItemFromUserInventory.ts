"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const deleteItemFromUserInventory = async (id: number) => {
  try {
    const deletedItem = await prisma.userInventory.delete({
      where: { id },
    });
    return deletedItem;
  } catch (error) {
    console.error("Error deleting item from user inventory:", error);
    throw new Error("Failed to delete item from user inventory");
  }
};
export default deleteItemFromUserInventory;
