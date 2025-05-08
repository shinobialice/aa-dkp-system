"use server";
import supabase from "@/lib/supabase";

export async function getAverageGuildGS() {
  const { data: users, error } = await supabase
    .from("user")
    .select("class_gear_score")
    .eq("active", true)
    .not("class_gear_score", "is", null);

  if (error || !users || users.length === 0) {
    return 0;
  }

  const sum = users.reduce((acc, u) => acc + (u.class_gear_score ?? 0), 0);
  const avg = sum / users.length;

  return Math.floor(avg / 500) * 500;
}
