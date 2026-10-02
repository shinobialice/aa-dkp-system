"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import sql from "@/shared/lib/db";

export async function logout() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // Гасим токен и в базе — иначе украденная кука продолжала бы работать
  // после выхода.
  if (sessionToken) {
    await sql`
      UPDATE "user" SET session_token = NULL WHERE session_token = ${sessionToken}
    `;
  }

  cookieStore.delete("session_token").delete("link-token");

  // Перенаправляем на страницу входа
  redirect("/login");
}
