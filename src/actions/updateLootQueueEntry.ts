"use server";
import supabase from "@/lib/supabase";

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
  const updateData: Record<string, unknown> = {};

  if (status !== undefined) updateData.status = status;
  if (synth_target !== undefined) updateData.synth_target = synth_target;
  if (delivered !== undefined) updateData.delivered = delivered;
  if (required !== undefined) updateData.required = required;

  const { data, error } = await supabase
    .from("loot_queue")
    .update(updateData)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("Ошибка при обновлении очереди на лут:", error);
    throw new Error("Не удалось обновить запись очереди");
  }

  return data;
};
