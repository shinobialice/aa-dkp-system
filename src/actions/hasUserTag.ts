"use server";

import { auth } from "@/auth";
import supabase from "@/lib/supabase";

export async function hasUserTag(tag: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    return false;
  }

  const { data, error } = await supabase
    .from("user_tags")
    .select("tag")
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Ошибка при получении тэгов пользователя:", error);
    return false;
  }

  return data?.some((t) => t.tag === tag) ?? false;
}
