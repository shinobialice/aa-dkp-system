"use server";
import { cookies } from "next/headers";
import supabase from "@/shared/lib/supabaseAdmin";
import { hasTag } from "./hasTag";
import { getSessionUserId } from "./getSessionUserId";
import { getUserSelfEditSettings } from "./userSelfEditSettings";

const editUser = async (
  userId: number,
  username: string,
  className: string,
  classGearScore: number,
  secondaryClassName: string | null,
  secondaryClassGearScore: number | null,
  vkName: string,
  joined_at: Date | string | null,
) => {
  const { data: existing } = await supabase
    .from("user")
    .select(
      "username, class, class_gear_score, secondary_class, secondary_class_gear_score, vk_name, joined_at, active",
    )
    .eq("id", userId)
    .maybeSingle();

  if (!existing) {
    throw new Error("Игрок не найден");
  }

  const normalizedJoinedAt = joined_at
    ? new Date(joined_at).toISOString()
    : null;

  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isPrivilegedEditor = await hasTag(sessionToken, [
    "Администратор",
    "Секретутка",
  ]);

  if (!isPrivilegedEditor) {
    const sessionUserId = await getSessionUserId();
    if (sessionUserId !== userId || !existing.active) {
      throw new Error("Access denied: insufficient privileges");
    }

    const existingJoinedAtTime = existing.joined_at
      ? new Date(existing.joined_at).getTime()
      : null;
    const newJoinedAtTime = normalizedJoinedAt
      ? new Date(normalizedJoinedAt).getTime()
      : null;

    const nicknameChanged = username !== existing.username;
    const gsChanged =
      className !== existing.class ||
      classGearScore !== existing.class_gear_score ||
      secondaryClassName !== existing.secondary_class ||
      secondaryClassGearScore !== existing.secondary_class_gear_score;
    const adminFieldsChanged =
      vkName !== existing.vk_name || newJoinedAtTime !== existingJoinedAtTime;

    if (adminFieldsChanged) {
      throw new Error("Access denied: insufficient privileges");
    }

    const selfEditSettings = await getUserSelfEditSettings();
    if (nicknameChanged && !selfEditSettings.nicknameEditEnabled) {
      throw new Error("Access denied: insufficient privileges");
    }
    if (gsChanged && !selfEditSettings.gsEditEnabled) {
      throw new Error("Access denied: insufficient privileges");
    }
  }

  const { data: user, error } = await supabase
    .from("user")
    .update({
      username,
      class: className,
      class_gear_score: classGearScore,
      secondary_class: secondaryClassName,
      secondary_class_gear_score: secondaryClassGearScore,
      vk_name: vkName,
      joined_at: normalizedJoinedAt,
    })
    .eq("id", userId)
    .select()
    .maybeSingle();

  if (error || !user) {
    console.error("Failed to update user:", error);
    throw new Error("Ошибка при обновлении игрока");
  }

  if (existing?.username && existing.username !== username) {
    const { error: historyError } = await supabase
      .from("user_username_history")
      .insert({
        user_id: userId,
        old_username: existing.username,
        new_username: username,
      });

    if (historyError) {
      console.error("Failed to log username change:", historyError);
    }
  }

  return user;
};

export default editUser;
