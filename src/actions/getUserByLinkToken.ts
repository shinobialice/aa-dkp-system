"use server";

import supabase from "@/shared/lib/supabase";
import type { Database } from "@/types/supabase";

// Define the shape you actually get back from that join
type LinkTokenWithUser = Database["public"]["Tables"]["link_token"]["Row"] & {
  user: { username: string }[];
};

export async function getUserByLinkToken(token: string) {
  // 1) Run the query without generics
  const { data, error } = await supabase
    .from("link_token")
    .select("token, used, expiresAt, user(username)")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error("Ошибка при получении linkToken:", error);
    return null;
  }

  // 2) Cast to your interface
  const result = data as LinkTokenWithUser | null;
  if (!result || result.used || new Date(result.expiresAt) < new Date()) {
    return null;
  }

  // 3) Pull out the first username
  const username = result.user[0]?.username;
  if (!username) {
    return null;
  }

  return {
    username,
    expiresAt: new Date(result.expiresAt).toISOString(),
  };
}
