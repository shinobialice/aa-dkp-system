"use server";

import { cookies } from "next/headers";
import supabase from "@/shared/lib/supabaseAdmin";
import { hasTag } from "./hasTag";
import { getUserSelfEditSettings } from "./userSelfEditSettings";

type SelfEditToggle = "nicknameEditEnabled" | "gsEditEnabled" | "inventoryEditEnabled";

// Разрешает Администратору/Секретутке всегда, а самому активному
// пользователю — только если соответствующий тумблер включен в Настройках.
const ensureCanEditUserData = async (
  userId: number,
  toggle: SelfEditToggle,
) => {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";

  if (await hasTag(sessionToken, ["Администратор", "Секретутка"])) return;

  const { data: sessionUser } = await supabase
    .from("user")
    .select("id, active")
    .eq("session_token", sessionToken)
    .maybeSingle();

  if (!sessionUser || sessionUser.id !== userId || !sessionUser.active) {
    throw new Error("Access denied: insufficient privileges");
  }

  const settings = await getUserSelfEditSettings();
  if (!settings[toggle]) {
    throw new Error("Access denied: insufficient privileges");
  }
};

export default ensureCanEditUserData;
