"use server";

import { cookies } from "next/headers";
import { hasTag, VIEW_AS_REGULAR_COOKIE } from "./hasTag";

export async function setViewAsRegular(enabled: boolean) {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isRealAdmin = await hasTag(sessionToken, ["Администратор"], {
    ignorePreview: true,
  });
  if (!isRealAdmin) return;

  const store = await cookies();
  if (enabled) {
    store.set(VIEW_AS_REGULAR_COOKIE, "1", { path: "/", sameSite: "lax" });
  } else {
    store.delete(VIEW_AS_REGULAR_COOKIE);
  }
}
