"use server";
import supabase from "@/shared/lib/supabaseAdmin";

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
    .select("username")
    .eq("id", userId)
    .maybeSingle();

  const { data: user, error } = await supabase
    .from("user")
    .update({
      username,
      class: className,
      class_gear_score: classGearScore,
      secondary_class: secondaryClassName,
      secondary_class_gear_score: secondaryClassGearScore,
      vk_name: vkName,
      joined_at: joined_at ? new Date(joined_at).toISOString() : null,
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
