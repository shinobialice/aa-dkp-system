"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

export type EventSettings = {
  title: string | null;
  imageUrl: string | null;
  startsAt: string | null;
  endsAt: string | null;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function getEventSettings(): Promise<EventSettings> {
  const { data, error } = await supabase
    .from("event_settings")
    .select("title,image_url,starts_at,ends_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Ошибка при получении настроек ивента:", error);
    throw new Error("Не удалось загрузить настройки ивента");
  }

  return {
    title: data?.title ?? null,
    imageUrl: data?.image_url ?? null,
    startsAt: data?.starts_at ?? null,
    endsAt: data?.ends_at ?? null,
  };
}

export async function updateEventSettings(input: {
  title: string;
  startsAt: string;
  endsAt: string;
}) {
  await ensurePrivilieges(["Администратор"]);

  if (new Date(input.endsAt).getTime() <= new Date(input.startsAt).getTime()) {
    throw new Error("Время окончания должно быть позже времени начала");
  }

  const { error } = await supabase.from("event_settings").upsert({
    id: 1,
    title: input.title,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Ошибка при сохранении настроек ивента:", error);
    throw new Error("Не удалось сохранить настройки ивента");
  }

  revalidatePath("/");
  revalidatePath("/settings");
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

  const path = "event-banner/banner";

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error("Failed to upload event banner:", uploadError);
    throw new Error("Не удалось загрузить картинку");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  const imageUrl = `${publicUrl}?t=${Date.now()}`;

  const { error: updateError } = await supabase.from("event_settings").upsert({
    id: 1,
    image_url: imageUrl,
    updated_at: new Date().toISOString(),
  });

  if (updateError) {
    console.error("Failed to save event banner url:", updateError);
    throw new Error("Не удалось сохранить картинку");
  }

  revalidatePath("/");
  revalidatePath("/settings");

  return imageUrl;
}

export async function endEventNow() {
  await ensurePrivilieges(["Администратор"]);

  const { error } = await supabase
    .from("event_settings")
    .update({ ends_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    console.error("Ошибка при завершении ивента:", error);
    throw new Error("Не удалось завершить ивент");
  }

  revalidatePath("/");
  revalidatePath("/settings");
}
