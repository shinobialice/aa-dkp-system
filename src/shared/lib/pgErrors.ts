import postgres from "postgres";

export const UNIQUE_VIOLATION = "23505";
export const FOREIGN_KEY_VIOLATION = "23503";

export function hasPgCode(error: unknown, code: string) {
  return error instanceof postgres.PostgresError && error.code === code;
}
