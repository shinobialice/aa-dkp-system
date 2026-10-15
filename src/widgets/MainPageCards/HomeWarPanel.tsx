import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { HomeWarSummary } from "@/actions/getHomeWarSummary";
import { avatarSrc, formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import ArenaPanel from "@/widgets/arena/ArenaPanel";
import CountUp from "@/widgets/arena/CountUp";
import { classColors } from "@/widgets/MembersTable/classStyles";

const PLACE_COLORS = ["text-[#e8b450]", "text-[#aab3c5]", "text-[#c98552]"];

type Props = {
  summary: HomeWarSummary;
};

export default function HomeWarPanel({ summary }: Props) {
  const since = new Date(summary.startedAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Moscow",
  });
  const totals = [
    { label: "Убийств", value: summary.totalKills },
    { label: "Хонора", value: summary.totalHonor },
    { label: "В киллкаунте", value: summary.fightersCount },
  ];

  return (
    <ArenaPanel
      title="Война"
      meta={`с ${since}`}
      className="arena-enter"
      action={
        <Link
          href="/war"
          className="inline-flex items-center gap-0.5 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"
        >
          Страница вара
          <ChevronRight className="size-4" />
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2.5">
            {totals.map((total) => (
              <div
                key={total.label}
                className="border-l-2 border-l-green-500 bg-muted/60 px-3 py-2.5"
              >
                <p className="font-display text-[clamp(20px,2.6vw,28px)] leading-tight tabular-nums">
                  <CountUp value={total.value} />
                </p>
                <p className="text-2xs tracking-wider text-muted-foreground uppercase">
                  {total.label}
                </p>
              </div>
            ))}
          </div>
          <MyPlace me={summary.me} />
        </div>
        <ol className="flex flex-col">
          {summary.top.map((player, index) => (
            <li
              key={player.userId}
              className="grid grid-cols-[28px_36px_minmax(0,1fr)_auto] items-center gap-2.5 border-t py-2 first:border-t-0"
            >
              <span
                className={cn(
                  "text-center font-display text-lg",
                  PLACE_COLORS[index],
                )}
              >
                {index + 1}
              </span>
              <Avatar
                className="size-9"
                style={{ boxShadow: classRing(player.userClass) }}
              >
                <AvatarImage
                  src={avatarSrc(player.userName, player.avatarUrl)}
                  alt=""
                />
                <AvatarFallback>{player.userName.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <span className="min-w-0">
                <span className="block truncate font-semibold">
                  {player.userName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {player.userClass}
                </span>
              </span>
              <span className="font-display tabular-nums">
                {formatNumber(player.kills, 0)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </ArenaPanel>
  );
}

function MyPlace({ me }: { me: HomeWarSummary["me"] }) {
  if (!me) {
    return (
      <p className="border border-dashed px-3 py-2.5 text-sm text-muted-foreground">
        Вас нет в киллкаунте этого вара, а свою явку можно посмотреть на
        странице вара
      </p>
    );
  }
  return (
    <p className="flex flex-wrap justify-between gap-2 border border-dashed px-3 py-2.5 text-sm">
      <span>
        Вы на{" "}
        <b className="font-display font-normal text-green-700 dark:text-green-400">
          {me.place}-м
        </b>{" "}
        месте
      </span>
      <span className="text-muted-foreground">
        {formatNumber(me.kills, 0)} убийств · {formatNumber(me.honor, 0)} хонора
      </span>
    </p>
  );
}

function classRing(userClass: string | null) {
  const color = userClass ? classColors[userClass] : "var(--border)";
  return `0 0 0 2px var(--card), 0 0 0 3.5px ${color}`;
}
