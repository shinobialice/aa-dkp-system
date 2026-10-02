import { getSessionUser } from "@/shared/lib/session";

export async function verifySessionToken(
  token: string,
): Promise<{ valid: boolean; reason?: "inactive" }> {
  if (!token) return { valid: false };

  let user;
  try {
    user = await getSessionUser(token);
  } catch (error) {
    console.error("Error verifying session token:", error);
    return { valid: false };
  }

  if (!user) return { valid: false };
  if (!user.active) return { valid: false, reason: "inactive" };

  return { valid: true };
}
