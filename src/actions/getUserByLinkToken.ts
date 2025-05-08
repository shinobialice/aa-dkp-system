"use server";

import supabase from "@/lib/supabase";

export async function getUserByLinkToken(token: string) {
  const { data: result, error } = await supabase
    .from("link_token")
    .select("token, used, expiresAt, user(username)")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error("Ошибка при получении linkToken:", error);
    return null;
  }

  if (!result || result.used || new Date(result.expiresAt) < new Date()) {
    return null;
  }

  return {
    username: result.user?.username,
    expiresAt: new Date(result.expiresAt).toISOString(),
  };
}
