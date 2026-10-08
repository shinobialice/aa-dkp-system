"use server";

import { isPromoSlug, type PromoSlug } from "@/shared/config/promoPages";
import sql from "@/shared/lib/db";
import type { EventSettingsRow } from "@/shared/lib/dbTypes";

import { saveUploadedFile } from "@/shared/lib/localStorage";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

type EventRow = Omit<EventSettingsRow, "id" | "updated_at">;

export type EventSettings = {
  title: string | null;
  imageUrl: string | null;
  startsAt: string | null;
  endsAt: string | null;
  link: string | null;
  promo: PromoSlug | null;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function getEventSettings(): Promise<EventSettings> {
  let data: EventRow | undefined;
  try {
    [data] = await sql<EventRow[]>`
      SELECT title, image_url, starts_at, ends_at, link, promo
      FROM event_settings WHERE id = 1
    `;
  } catch (error) {
    console.error("Ошибка при получении настроек ивента:", error);
    throw new Error("Не удалось загрузить настройки ивента");
  }

  return {
    title: data?.title ?? null,
    imageUrl: data?.image_url ?? null,
    startsAt: data?.starts_at ?? null,
    endsAt: data?.ends_at ?? null,
    link: data?.link ?? null,
    promo: parsePromo(data?.promo),
  };
}

function parsePromo(value: string | null | undefined) {
  if (!value || !isPromoSlug(value)) return null;
  return value;
}

export async function updateEventSettings(input: {
  title: string;
  startsAt: string;
  endsAt: string;
  link: string;
  promo: string | null;
}) {
  await ensurePrivilieges(["Администратор"]);

  if (new Date(input.endsAt).getTime() <= new Date(input.startsAt).getTime()) {
    throw new Error("Время окончания должно быть позже времени начала");
  }
  if (input.promo !== null && !isPromoSlug(input.promo)) {
    throw new Error("Такой промо-страницы нет");
  }

  try {
    await sql`
      INSERT INTO event_settings
        (id, title, starts_at, ends_at, link, promo, updated_at)
      VALUES (
        1, ${input.title}, ${input.startsAt}, ${input.endsAt}, ${input.link},
        ${input.promo}, now()
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        starts_at = EXCLUDED.starts_at,
        ends_at = EXCLUDED.ends_at,
        link = EXCLUDED.link,
        promo = EXCLUDED.promo,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении настроек ивента:", error);
    throw new Error("Не удалось сохранить настройки ивента");
  }

  revalidatePath("/", "layout");
}

export async function uploadEventBanner(formData: FormData): Promise<string> {
  await ensurePrivilieges(["Администратор"]);

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Файл не передан");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Допустимы только изображения PNG, JPEG, WEBP или GIF");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Файл слишком большой (максимум 5 МБ)");
  }

  let publicUrl: string;
  try {
    publicUrl = await saveUploadedFile("avatars", "event-banner/banner", file);
  } catch (uploadError) {
    console.error("Failed to upload event banner:", uploadError);
    throw new Error("Не удалось загрузить картинку");
  }

  const imageUrl = `${publicUrl}?t=${Date.now()}`;

  try {
    await sql`
      INSERT INTO event_settings (id, image_url, updated_at)
      VALUES (1, ${imageUrl}, now())
      ON CONFLICT (id) DO UPDATE SET
        image_url = EXCLUDED.image_url,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (updateError) {
    console.error("Failed to save event banner url:", updateError);
    throw new Error("Не удалось сохранить картинку");
  }

  revalidatePath("/", "layout");

  return imageUrl;
}

export async function endEventNow() {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql`
      UPDATE event_settings SET ends_at = now() WHERE id = 1
    `;
  } catch (error) {
    console.error("Ошибка при завершении ивента:", error);
    throw new Error("Не удалось завершить ивент");
  }

  revalidatePath("/", "layout");
}
