"use server";

import sql from "@/shared/lib/db";
import type { ScreenshotsLinkSettingsRow } from "@/shared/lib/dbTypes";

import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

type LinkRow = Pick<ScreenshotsLinkSettingsRow, "url" | "month_label">;

export type ScreenshotsLinkSettings = {
  url: string;
  monthLabel: string;
};

const DEFAULT_SETTINGS: ScreenshotsLinkSettings = {
  url: "https://drive.google.com/drive/folders/1riLVkUlz0mKlKrsQZ7quIuG1rPF0-FGS?hl=ru",
  monthLabel: "Август",
};

export async function getScreenshotsLinkSettings(): Promise<ScreenshotsLinkSettings> {
  let data: LinkRow | undefined;
  try {
    [data] = await sql<LinkRow[]>`
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
  await ensurePrivilieges(["Администратор", "Секретутка"]);

  try {
    await sql`
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
