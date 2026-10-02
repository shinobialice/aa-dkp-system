import crypto from "crypto";
import { NextResponse } from "next/server";
import sql from "@/shared/lib/db";
import { getBaseUrl } from "./getBaseUrl";

type SocialIdColumn = "vk_id" | "google_id" | "mail_id";

const baseUrl = getBaseUrl();

export function loginErrorRedirect(reason?: string) {
  const url = new URL("/login-error", baseUrl);
  if (reason) url.searchParams.set("reason", reason);
  return NextResponse.redirect(url);
}

function withSession(response: NextResponse, sessionToken: string) {
  response.cookies.set("session_token", sessionToken, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

// Общий финал OAuth-callback'ов: при наличии link-token привязывает соцсеть
// к профилю из токена, иначе входит в профиль, к которому она уже привязана.
export async function completeSocialAuth(
  column: SocialIdColumn,
  socialId: string,
  linkToken: string | undefined,
) {
  const sessionToken = crypto.randomBytes(32).toString("hex");

  if (linkToken) {
    const [linkRow] = await sql<any[]>`
      SELECT "userId" FROM link_token
      WHERE token = ${linkToken} AND used = false AND "expiresAt" > now()
    `;

    if (!linkRow) {
      return clearLinkToken(loginErrorRedirect("link-expired"));
    }

    // Одна соцсеть — один профиль: иначе вход по ней попадал бы в случайный.
    const [owner] = await sql<any[]>`
      SELECT id FROM "user"
      WHERE ${sql(column)} = ${socialId} AND id <> ${linkRow.userId}
    `;

    if (owner) {
      return clearLinkToken(loginErrorRedirect("already-linked"));
    }

    // Пометка used и проверка срока одним запросом — ссылку нельзя
    // использовать дважды, даже если два входа пришли одновременно.
    const [consumed] = await sql<any[]>`
      UPDATE link_token SET used = true
      WHERE token = ${linkToken} AND used = false AND "expiresAt" > now()
      RETURNING "userId"
    `;

    if (!consumed) {
      return clearLinkToken(loginErrorRedirect("link-expired"));
    }

    await sql`
      UPDATE "user"
      SET ${sql(column)} = ${socialId}, session_token = ${sessionToken}
      WHERE id = ${consumed.userId}
    `;

    return withSession(
      clearLinkToken(
        NextResponse.redirect(new URL("/link-account/complete", baseUrl)),
      ),
      sessionToken,
    );
  }

  const [existingUser] = await sql<any[]>`
    SELECT id, active FROM "user" WHERE ${sql(column)} = ${socialId}
  `;

  if (!existingUser) {
    return loginErrorRedirect();
  }

  if (!existingUser.active) {
    return loginErrorRedirect("inactive");
  }

  await sql`
    UPDATE "user" SET session_token = ${sessionToken} WHERE id = ${existingUser.id}
  `;

  return withSession(
    NextResponse.redirect(new URL("/", baseUrl)),
    sessionToken,
  );
}

function clearLinkToken(response: NextResponse) {
  response.cookies.set("link-token", "", { path: "/", maxAge: -1 });
  return response;
}
