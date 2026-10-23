import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { KillcountEntry } from "@/server/killcountEntries/types";
import { Button } from "@/shared/ui";
import { longDate, weekday } from "../ui/killcountModel";
import { KIND_LABEL, timeOf, windowText } from "./killcountEntriesModel";
import RaidChips from "./RaidChips";

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
