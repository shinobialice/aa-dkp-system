"use server";

import { prisma } from "@/lib/db";

export const updateLootQueueEntry = async ({
  id,
  status,
  synthTarget,
  delivered,
  required,
}: {
  id: number;
  status?: string;
  synthTarget?: string;
  delivered?: number;
  required?: number;
}) => {
  const data: any = {};

  if (status) data.status = status;
  if (synthTarget !== undefined) data.synthTarget = synthTarget;
  if (required !== undefined && delivered !== undefined) {
    data.remaining = required - delivered;
  }

  return prisma.lootQueue.update({
    where: { id },
    data,
  });
};
