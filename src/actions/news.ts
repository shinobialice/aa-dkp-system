"use server";

import supabase from "@/lib/supabase";

export async function getNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false });

  if (error || !data) {
    console.error("Ошибка при загрузке новостей:", error);
    throw new Error("Не удалось получить новости");
  }

  return data;
}

export async function createNews(title: string, content: string) {
  const { data, error } = await supabase
    .from("news")
    .insert([{ title, content }])
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("Ошибка при создании новости:", error);
    throw new Error("Не удалось создать новость");
  }

  return data;
}

export async function updateNews(id: number, title: string, content: string) {
  const { data, error } = await supabase
    .from("news")
    .update({ title, content })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("Ошибка при обновлении новости:", error);
    throw new Error("Не удалось обновить новость");
  }

  return data;
}

export async function deleteNews(id: number) {
  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    console.error("Ошибка при удалении новости:", error);
    throw new Error("Не удалось удалить новость");
  }
}
