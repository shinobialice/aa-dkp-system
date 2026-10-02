import { hasTag } from "@/actions/hasTag";
import { Button } from "@/shared/ui";
import {
  getKillCountByDate,
  getKillCountHistory,
} from "@/widgets/killcount/api/history";
import { KillcountHeader } from "@/widgets/killcount/ui/KillcountHeader";
import { KillcountDay } from "@/widgets/killcount/ui/KillcountDay";
import { dayKey, longDate } from "@/widgets/killcount/ui/killcountModel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

function DayLink({
  date,
  label,
  children,
}: {
  date: string | undefined;
  label: string;
  children: React.ReactNode;
}) {
  if (!date) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label={label}>
        {children}
      </Button>
    );
  }
  return (
    <Button variant="ghost" size="icon" asChild aria-label={label}>
      <Link prefetch={false} href={`/kill-counter/history/${date}`}>
        {children}
      </Link>
    </Button>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const sessionToken = (await cookies()).get("session_token")?.value ?? "";

  const [isAdmin, dataByDate, history] = await Promise.all([
    hasTag(sessionToken, ["Администратор"]),
    getKillCountByDate(slug),
    getKillCountHistory(),
  ]);

  // history — от новых к старым: "раньше" — следующий элемент, "позже" — предыдущий.
  const dates = (history ?? []).map((day) => dayKey(day.date));
  const index = dates.indexOf(slug);
  const earlier = index >= 0 ? dates[index + 1] : undefined;
  const later = index > 0 ? dates[index - 1] : undefined;

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <KillcountHeader
        title={`Киллкаунт за ${longDate(slug)}`}
        subtitle="День из истории"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/kill-counter/history">
              <ChevronLeft className="size-4" />
              История
            </Link>
          </Button>
          <span className="inline-flex rounded-lg border">
            <DayLink date={earlier} label="Предыдущий день">
              <ChevronLeft className="size-4" />
            </DayLink>
            <DayLink date={later} label="Следующий день">
              <ChevronRight className="size-4" />
            </DayLink>
          </span>
        </div>
      </KillcountHeader>

      <KillcountDay data={dataByDate} mode="saved" isCanEdit={isAdmin} />
    </div>
  );
}
