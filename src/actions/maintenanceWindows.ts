"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

export type MaintenanceWindowRow = {
  id: number;
  startAt: string;
  endAt: string;
};

export async function getMaintenanceWindows(): Promise<MaintenanceWindowRow[]> {
  const { data, error } = await supabase
    .from("boss_maintenance_windows")
    .select("id,start_at,end_at")
    .gt("end_at", new Date().toISOString())
    .order("start_at", { ascending: true });

  if (error) {
    console.error("Ошибка при получении окон профилактики:", error);
    throw new Error("Не удалось загрузить окна профилактики");
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    startAt: row.start_at,
    endAt: row.end_at,
  }));
}

export async function addMaintenanceWindow(
  startAt: string,
  endAt: string,
  userId: number,
) {
  await ensurePrivilieges(["Администратор"]);

  if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
    throw new Error("Время окончания должно быть позже времени начала");
  }

  const { error } = await supabase.from("boss_maintenance_windows").insert({
    start_at: startAt,
    end_at: endAt,
    created_by: userId,
  });

  if (error) {
    console.error("Ошибка при создании окна профилактики:", error);
    throw new Error("Не удалось создать окно профилактики");
  }

  revalidatePath("/settings");
}

export async function extendMaintenanceWindow(id: number, endAt: string) {
  await ensurePrivilieges(["Администратор"]);

  const { data: existing, error: fetchError } = await supabase
    .from("boss_maintenance_windows")
    .select("start_at")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    throw new Error("Окно профилактики не найдено");
  }

  if (new Date(endAt).getTime() <= new Date(existing.start_at).getTime()) {
    throw new Error("Время окончания должно быть позже времени начала");
  }

  const { error } = await supabase
    .from("boss_maintenance_windows")
    .update({ end_at: endAt })
    .eq("id", id);

  if (error) {
    console.error("Ошибка при продлении окна профилактики:", error);
    throw new Error("Не удалось продлить окно профилактики");
  }

  revalidatePath("/settings");
}

export async function deleteMaintenanceWindow(id: number) {
  await ensurePrivilieges(["Администратор"]);

  const { error } = await supabase
    .from("boss_maintenance_windows")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Ошибка при удалении окна профилактики:", error);
    throw new Error("Не удалось удалить окно профилактики");
  }

  revalidatePath("/settings");
}
