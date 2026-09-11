import sql from "@/shared/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const VIEW_AS_REGULAR_COOKIE = "view_as_regular";

export const hasTag = async (
  sessionToken: string,
  tags: string[],
  opts?: { ignorePreview?: boolean },
) => {
  const [user] = await sql<any[]>`
    SELECT id FROM "user" WHERE session_token = ${sessionToken}
  `;

  if (!user) {
    redirect("login");
  }

  const [tagRow] = await sql<any[]>`
    SELECT tag FROM user_tags
    WHERE user_id = ${user.id} AND tag = ANY(${tags}) AND removed_at IS NULL
  `;

  const hasRealTag = !!tagRow;

  if (!hasRealTag || opts?.ignorePreview) {
    return hasRealTag;
  }

  const previewActive =
    (await cookies()).get(VIEW_AS_REGULAR_COOKIE)?.value === "1";
  return !previewActive;
};
