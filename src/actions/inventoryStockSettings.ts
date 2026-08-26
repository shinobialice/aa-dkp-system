"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

export type InventoryStockSettings = {
  hiddenLabels: string[];
};

const DEFAULT_SETTINGS: InventoryStockSettings = { hiddenLabels: [] };

export async function getInventoryStockSettings(): Promise<InventoryStockSettings> {
  try {
    const [data] = await sql<any[]>`
      SELECT hidden_labels FROM inventory_stock_settings WHERE id = 1
    `;

    if (!data) return DEFAULT_SETTINGS;

    return { hiddenLabels: (data.hidden_labels ?? []) as string[] };
  } catch (error) {
    console.error(
      "Ошибка при получении настроек 'Имеющиеся предметы':",
      error,
    );
    throw new Error("Не удалось загрузить настройки 'Имеющиеся предметы'");
  }
}

export async function updateInventoryStockSettings(
  settings: InventoryStockSettings,
) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql<any[]>`
      INSERT INTO inventory_stock_settings (id, hidden_labels, updated_at)
      VALUES (1, ${settings.hiddenLabels}, now())
      ON CONFLICT (id) DO UPDATE SET
        hidden_labels = EXCLUDED.hidden_labels,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error(
      "Ошибка при сохранении настроек 'Имеющиеся предметы':",
      error,
    );
    throw new Error("Не удалось сохранить настройки 'Имеющиеся предметы'");
  }

  revalidatePath("/settings");
  revalidatePath("/stats");
}
