"use server";
import { prisma } from "@/lib/db";

const deleteUserTask = async (id: number) => {
  try {
    const deletedTask = await prisma.tasks.delete({
      where: { id },
    });
    return deletedTask;
  } catch (error) {
    throw new Error("Failed to delete task");
  }
};
export default deleteUserTask;
