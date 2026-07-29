import supabase from "@/shared/lib/supabaseAdmin";

export async function verifySessionToken(token: string): Promise<boolean> {
  if (!token) return false;

  const { data: user, error } = await supabase
    .from("user")
    .select("id")
    .eq("session_token", token)
    .maybeSingle();

  if (error) {
    console.error("Error verifying session token:", error);
    return false;
  }

  return !!user;
}
