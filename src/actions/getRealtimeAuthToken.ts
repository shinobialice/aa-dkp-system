"use server";

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import supabase from "@/shared/lib/supabaseAdmin";

// Supabase Realtime авторизует приватные каналы через RLS-политики на
// realtime.messages, которые смотрят на JWT, переданный клиентом через
// supabase.realtime.setAuth(). У нас нет Supabase Auth (своя кука
// session_token) — подписываем этот JWT сами тем же секретом, которым
// подписаны токены самого проекта, чтобы Realtime принял его как обычный
// authenticated-токен. Это не открывает новый путь к данным: сам broadcast
// не несёт строк из таблиц, только пинг "что-то изменилось" (см.
// supabase-realtime-broadcast.sql) — реальное чтение как и раньше идёт
// через server actions на supabaseAdmin.
const TOKEN_TTL_SECONDS = 60 * 60;

export async function getRealtimeAuthToken(): Promise<string | null> {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  if (!sessionToken) return null;

  const { data: user, error } = await supabase
    .from("user")
    .select("id, active")
    .eq("session_token", sessionToken)
    .maybeSingle();

  if (error || !user || !user.active) return null;

  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) {
    console.error(
      "SUPABASE_JWT_SECRET не задан — realtime-авторизация недоступна",
    );
    return null;
  }

  return new SignJWT({ role: "authenticated" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(new TextEncoder().encode(secret));
}
