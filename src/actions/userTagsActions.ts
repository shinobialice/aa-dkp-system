"use server";
import supabase from "@/shared/lib/supabase";

// 1. Get user tags
export async function getUserTags(userId: number) {
  const { data, error } = await supabase
    .from("user_tags")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка при получении тэгов:", error);
    throw new Error("Не удалось загрузить тэги");
  }

  return data;
}

// 2. Add a new tag
export async function addUserTag(userId: number, tag: string) {
  const { data, error } = await supabase
    .from("user_tags")
    .insert([{ user_id: userId, tag }])
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("Ошибка при добавлении тэга:", error);
    throw new Error("Не удалось добавить тэг");
  }

  return data;
}

// 3. Delete tag by ID
export async function deleteUserTag(tagId: number) {
  const { error } = await supabase.from("user_tags").delete().eq("id", tagId);

  if (error) {
    console.error("Ошибка при удалении тэга:", error);
    throw new Error("Не удалось удалить тэг");
  }
}
