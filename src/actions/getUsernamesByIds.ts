"use server";

import supabase from "@/shared/lib/supabaseAdmin";

export const getUsernamesByIds = async (
  userIds: number[],
): Promise<Record<number, string>> => {
  if (userIds.length === 0) return {};

  const { data, error } = await supabase
    .from("user")
    .select("id, username")
    .in("id", userIds);

  if (error || !data) {
    return {};
  }

  const result: Record<number, string> = {};
  data.forEach((u: any) => {
    result[u.id] = u.username;
  });
  return result;
};
