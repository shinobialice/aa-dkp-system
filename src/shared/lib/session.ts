import crypto from "crypto";
import sql from "@/shared/lib/db";

// Должно совпадать с maxAge куки session_token.
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// В базе лежит только хэш: токен из утёкшего дампа не подойдёт к куке.
function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: number, userAgent?: string | null) {
  const token = crypto.randomBytes(32).toString("hex");

  // Заодно подчищаем протухшие сессии этого игрока, чтобы таблица не росла.
  await sql`
    DELETE FROM user_session WHERE user_id = ${userId} AND expires_at < now()
  `;
  await sql`
    INSERT INTO user_session (token_hash, user_id, expires_at, user_agent)
    VALUES (
      ${hashToken(token)},
      ${userId},
      now() + make_interval(secs => ${SESSION_MAX_AGE_SECONDS}),
      ${userAgent ?? null}
    )
  `;

  return token;
}

export async function getSessionUser(
  token: string | undefined,
): Promise<{ id: number; active: boolean } | null> {
  if (!token) return null;

  const [user] = await sql<{ id: number; active: boolean }[]>`
    SELECT u.id, u.active
    FROM user_session s
    JOIN "user" u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)} AND s.expires_at > now()
  `;

  return user ?? null;
}

export async function deleteSession(token: string) {
  await sql`DELETE FROM user_session WHERE token_hash = ${hashToken(token)}`;
}

export async function deleteUserSessions(userId: number) {
  await sql`DELETE FROM user_session WHERE user_id = ${userId}`;
}
