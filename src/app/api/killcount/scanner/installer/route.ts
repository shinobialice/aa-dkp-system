import { readFile } from "node:fs/promises";
import { cookies } from "next/headers";
import { hasTag } from "@/actions/hasTag";
import { KILLCOUNT_EDITOR_TAGS } from "@/server/killcountEditors";

export const dynamic = "force-dynamic";

// Установщик не хранится в открытом репозитории: его кладут на сервер вручную.
const INSTALLER_PATH =
  process.env.SCANNER_INSTALLER_PATH ??
  "/opt/corvus-scanner/CorvusScannerSetup.exe";

export async function GET() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  if (!(await hasTag(sessionToken, KILLCOUNT_EDITOR_TAGS))) {
    return textResponse(
      "Сканер доступен только администраторам и модераторам",
      403,
    );
  }
  const installer = await readInstaller();
  if (!installer) {
    return textResponse("Установщик ещё не загружен на сервер", 404);
  }
  return new Response(new Uint8Array(installer), {
    headers: {
      "Content-Type": "application/vnd.microsoft.portable-executable",
      "Content-Disposition": 'attachment; filename="CorvusScannerSetup.exe"',
      "Cache-Control": "private, no-store",
    },
  });
}

async function readInstaller() {
  try {
    return await readFile(INSTALLER_PATH);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function textResponse(text: string, status: number) {
  return new Response(text, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
