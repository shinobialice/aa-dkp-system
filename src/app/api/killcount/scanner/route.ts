import { cookies } from "next/headers";
import { hasTag } from "@/actions/hasTag";
import { KILLCOUNT_EDITOR_TAGS } from "@/server/killcountEditors";
import { buildScannerZip } from "@/server/scannerBundle";

export const dynamic = "force-dynamic";

// Сканер киллкаунта (tools/corvus-pvp) архивом — только тем, кто заполняет
// киллкаунт. Без входа hasTag отправляет на /login.
export async function GET() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  if (!(await hasTag(sessionToken, KILLCOUNT_EDITOR_TAGS))) {
    return new Response(
      "Сканер доступен только администраторам и модераторам",
      {
        status: 403,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }
  const zip = await buildScannerZip();
  return new Response(new Uint8Array(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="corvus-pvp-scanner.zip"',
      "Cache-Control": "private, no-store",
    },
  });
}
