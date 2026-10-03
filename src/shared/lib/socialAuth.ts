import { NextResponse } from "next/server";
import sql from "@/shared/lib/db";
import { getBaseUrl } from "./getBaseUrl";
import { createSession, SESSION_MAX_AGE_SECONDS } from "./session";
import type { LinkTokenRow, UserRow } from "./dbTypes";

type SocialIdColumn = "vk_id" | "google_id" | "mail_id";

export function loginErrorRedirect(reason?: string) {
  const url = new URL("/login-error", getBaseUrl());
  if (reason) url.searchParams.set("reason", reason);
  return NextResponse.redirect(url);
}

function withSession(response: NextResponse, sessionToken: string) {
  response.cookies.set("session_token", sessionToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

// Общий финал OAuth-callback'ов: при наличии link-token привязывает соцсеть
// к профилю из токена, иначе входит в профиль, к которому она уже привязана.
export async function completeSocialAuth(
  column: SocialIdColumn,
  socialId: string,
  linkToken: string | undefined,
  userAgent: string | null,
) {
  if (linkToken) {
    const [linkRow] = await sql<Pick<LinkTokenRow, "userId">[]>`
      SELECT "userId" FROM link_token
      WHERE token = ${linkToken} AND used = false AND "expiresAt" > now()
    `;

    if (!linkRow) {
      return clearLinkToken(loginErrorRedirect("link-expired"));
    }

    // Одна соцсеть — один профиль: иначе вход по ней попадал бы в случайный.
    const [owner] = await sql<Pick<UserRow, "id">[]>`
      SELECT id FROM "user"
      WHERE ${sql(column)} = ${socialId} AND id <> ${linkRow.userId}
    `;

    if (owner) {
      return clearLinkToken(loginErrorRedirect("already-linked"));
    }

    // Пометка used и проверка срока одним запросом — ссылку нельзя
    // использовать дважды, даже если два входа пришли одновременно.
    const [consumed] = await sql<Pick<LinkTokenRow, "userId">[]>`
      UPDATE link_token SET used = true
      WHERE token = ${linkToken} AND used = false AND "expiresAt" > now()
      RETURNING "userId"
    `;

    if (!consumed) {
      return clearLinkToken(loginErrorRedirect("link-expired"));
    }

    await sql`
      UPDATE "user"
      SET ${sql(column)} = ${socialId}
      WHERE id = ${consumed.userId}
    `;

    const sessionToken = await createSession(consumed.userId, userAgent);

    return withSession(
      clearLinkToken(
        NextResponse.redirect(new URL("/link-account/complete", getBaseUrl())),
      ),
      sessionToken,
    );
  }

  const [existingUser] = await sql<Pick<UserRow, "id" | "active">[]>`
    SELECT id, active FROM "user" WHERE ${sql(column)} = ${socialId}
  `;

  if (!existingUser) {
    return loginErrorRedirect();
  }

  if (!existingUser.active) {
    return loginErrorRedirect("inactive");
  }

  const sessionToken = await createSession(existingUser.id, userAgent);

  return withSession(
    NextResponse.redirect(new URL("/", getBaseUrl())),
    sessionToken,
  );
}

function clearLinkToken(response: NextResponse) {
  response.cookies.set("link-token", "", { path: "/", maxAge: -1 });
  return response;
}
