import supabase from "@/lib/supabase";

export const hasTag = async (sessionToken: string, tags: string[]) => {
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("id")
      .eq("session_token", sessionToken)
      .single();
  
    if (!user || userError) {
      throw new Error("Invalid session");
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
  