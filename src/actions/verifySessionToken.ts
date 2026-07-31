import supabase from "@/shared/lib/supabaseAdmin";

export async function verifySessionToken(
  token: string,
): Promise<{ valid: boolean; reason?: "inactive" }> {
  if (!token) return { valid: false };

  const { data: user, error } = await supabase
    .from("user")
    .select("id, active")
    .eq("session_token", token)
    .maybeSingle();

  if (error || !user) {
    if (error) console.error("Error verifying session token:", error);
    return { valid: false };
  }

  if (!user.active) return { valid: false, reason: "inactive" };

  return { valid: true };
}
