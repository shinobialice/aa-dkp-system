"use server";

import { prisma } from "@/lib/db";

export const updateLootQueueEntry = async ({
  id,
  status,
  synth_target,
  delivered,
  required,
}: {
  id: number;
  status?: string;
  synth_target?: string;
  delivered?: number;
  required?: number;
}) => {
  const data: any = {};

  if (status) data.status = status;
  if (synth_target !== undefined) data.synth_target = synth_target;
  if (required !== undefined) data.required = required;
  if (delivered !== undefined) data.delivered = delivered;

  return prisma.lootQueue.update({
    where: { id },
    data,
  });
};
