"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

export type ScreenshotsLinkSettings = {
  url: string;
  monthLabel: string;
};

const DEFAULT_SETTINGS: ScreenshotsLinkSettings = {
  url: "https://drive.google.com/drive/folders/1riLVkUlz0mKlKrsQZ7quIuG1rPF0-FGS?hl=ru",
  monthLabel: "Август",
};

export async function getScreenshotsLinkSettings(): Promise<ScreenshotsLinkSettings> {
  let data;
  try {
    [data] = await sql<any[]>`
      SELECT url, month_label FROM screenshots_link_settings WHERE id = 1
    `;
  } catch (error) {
    console.error("Ошибка при получении ссылки на скрины:", error);
    throw new Error("Не удалось загрузить ссылку на скрины");
  }

  if (!data) return DEFAULT_SETTINGS;

  return { url: data.url, monthLabel: data.month_label };
}

export async function updateScreenshotsLinkSettings(
  settings: ScreenshotsLinkSettings,
) {
  // Ссылку на диск со скринами могут менять админ и секретутка — они же
  // обычно и заводят папку на новый месяц.
  await ensurePrivilieges(["Администратор", "Секретутка"]);

  try {
    await sql<any[]>`
      INSERT INTO screenshots_link_settings (id, url, month_label, updated_at)
      VALUES (1, ${settings.url}, ${settings.monthLabel}, now())
      ON CONFLICT (id) DO UPDATE SET
        url = EXCLUDED.url,
        month_label = EXCLUDED.month_label,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении ссылки на скрины:", error);
    throw new Error("Не удалось сохранить ссылку на скрины");
  }

  revalidatePath("/activities");
}
