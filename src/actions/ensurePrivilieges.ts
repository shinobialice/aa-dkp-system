import { cookies } from "next/headers";
import { hasTag } from "./hasTag";

const ensurePrivilieges = async (tags: string[]) => {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const hasPrivileges = await hasTag(sessionToken, tags);
  if (!hasPrivileges) {
    throw new Error("Access denied: insufficient privileges");
  }
};

export default ensurePrivilieges;
