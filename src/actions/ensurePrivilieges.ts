import { cookies } from "next/headers";
import { hasTag } from "./hasTag";

const ensurePrivilieges = async (tags: string[]) => {
  const sessionToken = (await cookies()).get("session_token").value;
  const hasPrivileges = await hasTag(sessionToken, tags);
  if (!hasPrivileges) {
    throw new Error("Idi nahui pidaras, u tebya net prav na etu operaciyu");
  }
};

export default ensurePrivilieges;
