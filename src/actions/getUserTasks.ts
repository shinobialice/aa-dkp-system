"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUserTasks = async (userId: number) => {
  const tasks = await prisma.tasks.findMany({
    where: { user_id: Number(userId) },
    select: {
      id: true,
      user_id: true,
      name: true,
      created_at: true,
      completed_at: true,
    },
  });
  return tasks;
};
export default getUserTasks;
