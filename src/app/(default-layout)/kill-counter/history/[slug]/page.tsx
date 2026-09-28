import { hasTag } from "@/actions/hasTag";
import { getKillCountByDate } from "@/widgets/killcount/api/history";
import { KillCountTable } from "@/widgets/killcount/ui/killcount-table";
import { cookies } from "next/headers";

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
      <h1 className="text-3xl font-bold mb-6 text-primary">
        История убийств за {new Date(slug).toLocaleDateString("ru-RU")}
      </h1>

      <KillCountTable isHistory data={dataByDate} isCanEdit={isAdmin} />
    </div>
  );
}
