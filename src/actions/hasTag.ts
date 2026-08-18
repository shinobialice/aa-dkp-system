import sql from "@/shared/lib/db";
import { redirect } from "next/navigation";

export const hasTag = async (sessionToken: string, tags: string[]) => {
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

  return !!tagRow;
};
