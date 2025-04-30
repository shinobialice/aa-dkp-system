"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const editUserTask = async (
  userId: number,
  taskId: number,
  name: string,
  createdAt: Date,
  completedAt: Date | null
) => {
  const updatedTask = await prisma.tasks.update({
    where: {
      id: taskId,
      user_id: userId,
    },
    data: {
      name,
      created_at: createdAt,
      completed_at: completedAt,
    },
  });
  return updatedTask;
};
export default editUserTask;
