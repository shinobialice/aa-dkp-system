"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getUserNotes = async (userId: number) => {
  const notes = [
    {
      id: 1,
      user_id: userId,
      content: "This is a mocked note.",
      created_at: new Date(),
    },
    {
      id: 2,
      user_id: userId,
      content: "This is another mocked note.",
      created_at: new Date(),
    },
  ];

  return notes;
};
export default getUserNotes;
