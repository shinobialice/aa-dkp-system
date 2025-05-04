"use server";
import { prisma } from "@/lib/db";

const createUserTask = async (
  userId: number,
  name: string,
  createdAt: Date,
  completedAt: Date | null
) => {
  const task = await prisma.tasks.create({
    data: {
      user_id: userId,
      name,
      created_at: createdAt,
      completed_at: completedAt,
    },
  });
  return task;
};
export default createUserTask;
