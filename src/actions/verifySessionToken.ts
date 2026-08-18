import sql from "@/shared/lib/db";

export async function verifySessionToken(
  token: string,
): Promise<{ valid: boolean; reason?: "inactive" }> {
  if (!token) return { valid: false };

  let user;
  try {
    [user] = await sql<any[]>`
      SELECT id, active FROM "user" WHERE session_token = ${token}
    `;
  } catch (error) {
    console.error("Error verifying session token:", error);
    return { valid: false };
  }

  if (!user) return { valid: false };
  if (!user.active) return { valid: false, reason: "inactive" };

  return { valid: true };
}
