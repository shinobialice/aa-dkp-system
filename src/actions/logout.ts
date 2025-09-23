"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logout() {
  // Удаляем куку
  const cookieStore = await cookies();

  cookieStore.delete("session_token").delete("link-token");

  // Перенаправляем на страницу входа
  redirect("/login");
}
