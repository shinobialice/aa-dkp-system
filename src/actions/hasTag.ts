import supabase from "@/shared/lib/supabase";
import { redirect } from "next/navigation";

export const hasTag = async (sessionToken: string, tags: string[]) => {
  const { data: user, error: userError } = await supabase
    .from("user")
    .select("id")
    .eq("session_token", sessionToken)
    .single();

  if (!user || userError) {
    redirect("login");
  }

  const { data: tagRow, error: tagError } = await supabase
    .from("user_tags")
    .select("tag")
    .eq("user_id", user.id)
    .in("tag", tags)
    .maybeSingle();

  if (tagError) {
    throw new Error(tagError.message);
  }
  return !!tagRow;
};
