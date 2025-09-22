import supabase from "@/lib/supabase";

export async function verifySessionToken(token: string): Promise<boolean> {
  if (!token) return false;

  const { data: session, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("session_token", token)
    .single();

  if (error) {
    console.error("Error verifying session token:", error);
    return false;
  }

  return !!session;
}
