import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { hasTag } from "@/actions/hasTag";
import { getMyScannerKeys } from "@/actions/scannerLink";
import { SCANNER_USER_TAGS } from "@/server/scanner/auth";
import { KillcountHeader } from "@/widgets/killcount/ui/KillcountHeader";
import ScannerPage from "@/widgets/killcount/ui/ScannerPage";

// Страница программы-сканера: для тех, кто заполняет киллкаунт или посещаемость.
export default async function KillcountScannerPage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  if (!(await hasTag(sessionToken, SCANNER_USER_TAGS))) notFound();
  const keys = await getMyScannerKeys();

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <KillcountHeader
        title="Сканер киллкаунта"
        subtitle="Программа для Windows: считывает состав рейда, честь и убийства игроков вокруг и отправляет на сайт"
      />
      <ScannerPage keys={keys} />
    </div>
  );
}
