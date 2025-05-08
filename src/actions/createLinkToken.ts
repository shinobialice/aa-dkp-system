"use server";

import { randomUUID } from "crypto";
import supabase from "@/lib/supabase";

export async function createLinkToken(userId: number) {
  const token = randomUUID();
  // Build the insert object to match your TS types exactly:
  const insertObj = {
    token,
    userId, // <-- camelCase
    expiresAt: new Date(Date.now() + 86400_000).toISOString(),
    used: false,
  };

  const { data, error } = await supabase
    .from("link_token")
    .insert([insertObj])
    .select() // if you want the row back
    .maybeSingle();

  if (error || !data) {
    console.error("Error creating link token:", error || "no data");
    throw new Error("Не удалось создать токен привязки");
  }

  return `${process.env.NEXT_PUBLIC_BASE_URL}/link-account/${token}`;
}
