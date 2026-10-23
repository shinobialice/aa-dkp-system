import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
  KillcountEntry,
  LinkedRaid,
} from "@/server/killcountEntries/types";
import { cn } from "@/shared/lib/tw-merge";
import { Button } from "@/shared/ui";
import { longDate, weekday } from "../../ui/killcountModel";
import { KIND_LABEL, timeOf, windowText } from "./killcountEntriesModel";

type Props = {
  entry: KillcountEntry;
  prevHref: string | null;
  nextHref: string | null;
};

export default function EntryHeader({ entry, prevHref, nextHref }: Props) {
  const { kind, day, window, raids } = entry;
  const title =
    kind === "agl" && window
      ? `АГЛ ${longDate(day)}, ${timeOf(window.startedAt)}`
      : `${KIND_LABEL[kind]} за ${longDate(day)}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg font-bold">
            {title}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {weekday(day)}
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">
            {window
              ? windowText(window)
              : "добавлен вручную, время не записано"}
          </p>
        </div>
        <span className="inline-flex rounded-lg border">
          <NavLink href={prevHref} label="Раньше">
            <ChevronLeft className="size-4" />
          </NavLink>
          <NavLink href={nextHref} label="Позже">
            <ChevronRight className="size-4" />
          </NavLink>
        </span>
      </div>
      <RaidChips raids={raids} kind={kind} />
    </div>
  );
}

function NavLink({
  href,
  label,
  children,
}: {
  href: string | null;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label={label}>
        {children}
      </Button>
    );
  }
  return (
    <Button variant="ghost" size="icon" asChild aria-label={label}>
      <Link prefetch={false} href={href}>
        {children}
      </Link>
    </Button>
  );
}

function RaidChips({ raids, kind }: { raids: LinkedRaid[]; kind: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="text-muted-foreground">
        {kind === "prime" ? "Рейды прайма:" : "Рейд:"}
      </span>
      {raids.length === 0 && (
        <span className="rounded-full border border-dashed px-2.5 py-0.5 text-muted-foreground">
          посещение ещё не заполнено
        </span>
      )}
      {raids.map((raid) => (
        <span
          key={raid.id}
          className={cn(
            "rounded-full border px-2.5 py-0.5",
            raid.isLinked ? "bg-muted" : "text-muted-foreground",
          )}
        >
          <span className="font-semibold tabular-nums">{raid.time}</span>{" "}
          {raid.boss}
          <span className="text-muted-foreground"> · {raid.people} чел.</span>
        </span>
      ))}
    </div>
  );
}
