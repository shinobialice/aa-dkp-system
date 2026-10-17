import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { hasTag } from "@/actions/hasTag";
import { KILLCOUNT_EDITOR_TAGS } from "@/server/killcountEditors";
import { KillcountHeader } from "@/widgets/killcount/ui/KillcountHeader";
import { ScannerPage } from "@/widgets/killcount/ui/ScannerPage";

// Страница программы-сканера: только для тех, кто заполняет киллкаунт.
export default async function KillcountScannerPage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  if (!(await hasTag(sessionToken, KILLCOUNT_EDITOR_TAGS))) notFound();

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <KillcountHeader
        title="Сканер киллкаунта"
        subtitle="Программа для Windows: считывает ники, класс, честь и убийства игроков вокруг — без скриншотов"
      />
      <ScannerPage />
    </div>
  );
}
