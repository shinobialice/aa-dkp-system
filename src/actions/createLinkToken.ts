"use server";

import { randomUUID } from "crypto";
import supabase from "@/lib/supabase";

export async function createLinkToken(userId: number) {
  const token = randomUUID();

  const { error } = await supabase.from("link_token").insert([
    {
      token,
      user_id: userId,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24h
      used: false,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error creating link token:", error);
    throw new Error("Не удалось создать токен привязки");
  }

  return `${process.env.NEXT_PUBLIC_BASE_URL}/link-account/${token}`;
}
