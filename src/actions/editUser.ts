"use server";
import supabase from "@/lib/supabase";

const editUser = async (
  userId: number,
  username: string,
  className: string,
  classGearScore: number,
  secondaryClassName: string | null,
  secondaryClassGearScore: number | null,
  vkName: string,
  joined_at: Date | string
) => {
  const { data: user, error } = await supabase
    .from("user")
    .update({
      username,
      class: className,
      class_gear_score: classGearScore,
      secondary_class: secondaryClassName,
      secondary_class_gear_score: secondaryClassGearScore,
      vk_name: vkName,
      joined_at: new Date(joined_at).toISOString(),
    })
    .eq("id", userId)
    .select()
    .maybeSingle();

  if (error || !user) {
    console.error("Failed to update user:", error);
    throw new Error("Ошибка при обновлении игрока");
  }

  return user;
};

export default editUser;
