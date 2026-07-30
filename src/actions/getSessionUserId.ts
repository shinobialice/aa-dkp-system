"use server";

import { cookies } from "next/headers";
import supabase from "@/shared/lib/supabaseAdmin";

export async function getSessionUserId(): Promise<number | null> {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  if (!sessionToken) return null;

  const { data: user } = await supabase
    .from("user")
    .select("id")
    .eq("session_token", sessionToken)
    .maybeSingle();

  return user?.id ?? null;
}
