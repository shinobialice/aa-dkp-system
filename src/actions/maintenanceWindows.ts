"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

export type MaintenanceWindowRow = {
  id: number;
  startAt: string;
  endAt: string;
};

export async function getMaintenanceWindows(): Promise<MaintenanceWindowRow[]> {
  let data;
  try {
    data = await sql<any[]>`
      SELECT id, start_at, end_at FROM boss_maintenance_windows
      WHERE end_at > now()
      ORDER BY start_at ASC
    `;
  } catch (error) {
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

  try {
    await sql<any[]>`
      INSERT INTO boss_maintenance_windows (start_at, end_at, created_by)
      VALUES (${startAt}, ${endAt}, ${userId})
    `;
  } catch (error) {
    console.error("Ошибка при создании окна профилактики:", error);
    throw new Error("Не удалось создать окно профилактики");
  }

  revalidatePath("/settings");
}

export async function extendMaintenanceWindow(id: number, endAt: string) {
  await ensurePrivilieges(["Администратор"]);

  const [existing] = await sql<any[]>`
    SELECT start_at FROM boss_maintenance_windows WHERE id = ${id}
  `;

  if (!existing) {
    throw new Error("Окно профилактики не найдено");
  }

  if (new Date(endAt).getTime() <= new Date(existing.start_at).getTime()) {
    throw new Error("Время окончания должно быть позже времени начала");
  }

  try {
    await sql<any[]>`
      UPDATE boss_maintenance_windows SET end_at = ${endAt} WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Ошибка при продлении окна профилактики:", error);
    throw new Error("Не удалось продлить окно профилактики");
  }

  revalidatePath("/settings");
}

export async function deleteMaintenanceWindow(id: number) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql<any[]>`
      DELETE FROM boss_maintenance_windows WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Ошибка при удалении окна профилактики:", error);
    throw new Error("Не удалось удалить окно профилактики");
  }

  revalidatePath("/settings");
}
