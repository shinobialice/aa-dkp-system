import { cookies } from "next/headers";
import { hasTag } from "@/actions/hasTag";
import { KILLCOUNT_EDITOR_TAGS } from "@/server/killcountEditors";
import { SCANNER_INSTALLER_URL } from "@/server/scannerBundle";

export const dynamic = "force-dynamic";

// Установщик собирает GitHub Actions (.github/workflows/scanner-installer.yml)
// и кладёт в релиз; сайт только пускает к ссылке тех, кто заполняет киллкаунт.
export async function GET() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  if (!(await hasTag(sessionToken, KILLCOUNT_EDITOR_TAGS))) {
    return new Response(
      "Сканер доступен только администраторам и модераторам",
      { status: 403, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }
  return Response.redirect(SCANNER_INSTALLER_URL, 302);
}
