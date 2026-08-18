"use server";
import sql from "@/shared/lib/db";

export const updateLootQueueEntry = async ({
  id,
  status,
  synth_target,
  delivered,
  required,
  roll,
}: {
  id: number;
  status?: string;
  synth_target?: string;
  delivered?: number;
  required?: number;
  roll?: number | null;
}) => {
  const updateData: Record<string, unknown> = {};

  if (status !== undefined) updateData.status = status;
  if (synth_target !== undefined) updateData.synth_target = synth_target;
  if (delivered !== undefined) updateData.delivered = delivered;
  if (required !== undefined) updateData.required = required;
  if (roll !== undefined) updateData.roll = roll;

  let data;
  try {
    [data] = await sql<any[]>`
      UPDATE loot_queue SET ${sql(updateData)} WHERE id = ${id} RETURNING *
    `;
  } catch (error) {
    console.error("Ошибка при обновлении очереди на лут:", error);
    throw new Error("Не удалось обновить запись очереди");
  }

  if (!data) {
    console.error("Ошибка при обновлении очереди на лут: not found");
    throw new Error("Не удалось обновить запись очереди");
  }

  return data;
};
