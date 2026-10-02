"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { deleteSession } from "@/shared/lib/session";

export async function logout() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // Гасим сессию и в базе — иначе украденная кука продолжала бы работать
  // после выхода. Остальные устройства игрока не трогаем.
  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  cookieStore.delete("session_token").delete("link-token");

  // Перенаправляем на страницу входа
  redirect("/login");
}
