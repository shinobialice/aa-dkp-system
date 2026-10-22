import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { hasTag } from "@/actions/hasTag";
import { getSessionUserId } from "@/actions/getSessionUserId";
import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";
import { SCANNER_CODE_PATTERN, SCANNER_USER_TAGS } from "@/server/scanner/auth";
import ConnectScanner from "@/widgets/scanner/ConnectScanner";

type Props = {
  searchParams: Promise<{ code?: string }>;
};

export default async function ScannerConnectPage({ searchParams }: Props) {
  const { code = "" } = await searchParams;
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const userId = await getSessionUserId();
  if (
    !SCANNER_CODE_PATTERN.test(code) ||
    userId === null ||
    !(await hasTag(sessionToken, SCANNER_USER_TAGS))
  ) {
    notFound();
  }

  const [user] = await sql<Pick<UserRow, "username">[]>`
    SELECT username FROM "user" WHERE id = ${userId}
  `;

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <ConnectScanner code={code} username={user.username} />
    </div>
  );
}
