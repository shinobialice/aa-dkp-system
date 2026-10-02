"use server";

import { cookies } from "next/headers";
import { getSessionUser } from "@/shared/lib/session";

export async function getSessionUserId(): Promise<number | null> {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  if (!sessionToken) return null;

  const user = await getSessionUser(sessionToken);

  return user?.id ?? null;
}
