import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { hasTag } from "@/actions/hasTag";
import { getScannerKeys } from "@/actions/scannerLink";
import { SCANNER_USER_TAGS } from "@/server/scanner/auth";
import ScannerPage from "@/widgets/scanner/ScannerPage";

export default async function ScannerRoute() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  if (!(await hasTag(sessionToken, SCANNER_USER_TAGS))) notFound();
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const keys = isAdmin ? await getScannerKeys() : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <ScannerPage keys={keys} />
    </div>
  );
}
