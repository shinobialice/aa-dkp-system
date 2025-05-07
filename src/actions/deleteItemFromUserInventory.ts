"use server";
import { prisma } from "@/lib/db";

const deleteItemFromUserInventory = async (id: number) => {
  try {
    const deletedItem = await prisma.userInventory.delete({
      where: { id },
    });
    return deletedItem;
  } catch (error) {
    throw new Error("Failed to delete item from user inventory");
  }
};
export default deleteItemFromUserInventory;
