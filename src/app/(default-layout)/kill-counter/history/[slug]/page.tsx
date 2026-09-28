import { hasTag } from "@/actions/hasTag";
import { Button } from "@/shared/ui";
import { getKillCountByDate } from "@/widgets/killcount/api/history";
import { KillCountTable } from "@/widgets/killcount/ui/killcount-table";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const sessionToken = (await cookies()).get("session_token")?.value ?? "";

  const isAdmin = await hasTag(sessionToken, ["Администратор"]);

  const dataByDate = await getKillCountByDate(slug);

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <Button variant="ghost" size="sm" className="w-fit mb-4" asChild>
        <Link href="/kill-counter/history">
          <ChevronLeft className="size-4" />
          Назад к истории
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6 text-primary">
        История убийств за {new Date(slug).toLocaleDateString("ru-RU")}
      </h1>

      <KillCountTable isHistory data={dataByDate} isCanEdit={isAdmin} />
    </div>
  );
}
