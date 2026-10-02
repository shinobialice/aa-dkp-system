"use client";

import { useState, type ReactNode } from "react";
import { Pencil, Swords } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import {
  saveWarOpponents,
  type WarOpponentDraft,
  type WarOpponentsState,
} from "@/actions/guildStatusSettings";
import WarOpponentsDialog from "./WarOpponentsDialog";
import { SectionEmpty, WarSection } from "./WarParts";
import {
  formatDayMonth,
  formatShortDate,
  formatSpan,
  useMinuteNow,
} from "./warModel";

export type OpponentView = {
  key: string;
  name: string;
  startedAt: string | null;
  endedAt: string | null;
  status: "active" | "ended" | "periodEnd";
};

const STATUS_LABEL: Record<OpponentView["status"], string> = {
  active: "Идёт",
  ended: "Слились",
  periodEnd: "До конца вара",
};

function OpponentTile({
  opponent,
  now,
}: {
  opponent: OpponentView;
  now: number | null;
}) {
  const active = opponent.status === "active";
  const endMs = opponent.endedAt ? new Date(opponent.endedAt).getTime() : now;
  const duration =
    opponent.startedAt && endMs !== null
      ? formatSpan(opponent.startedAt, endMs)
      : null;
  const since = !opponent.startedAt
    ? null
    : opponent.status === "ended" && opponent.endedAt
      ? `${formatShortDate(opponent.startedAt)} — ${formatShortDate(opponent.endedAt)}`
      : `с ${formatDayMonth(opponent.startedAt)}`;

  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-lg bg-muted/50 px-3 py-2.5 sm:px-4 sm:py-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">против</span>
        <span
          className={cn(
            "hidden items-center gap-1.5 text-xs font-semibold sm:inline-flex",
            active ? "text-red-700 dark:text-red-400" : "text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              active ? "bg-red-600" : "bg-muted-foreground/60",
            )}
          />
          {STATUS_LABEL[opponent.status]}
        </span>
      </div>
      <span
        className={cn(
          "truncate text-[17px] leading-tight font-bold sm:text-xl",
          active ? "text-red-700 dark:text-red-400" : "text-muted-foreground",
        )}
      >
        {opponent.name}
      </span>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-1.5">
        {duration && (
          <span className="font-semibold tabular-nums sm:text-[15px]">
            {duration}
          </span>
        )}
        {since && (
          <span className="text-xs text-muted-foreground">{since}</span>
        )}
      </div>
    </div>
  );
}

export function WarOpponentsCard({
  opponents,
  action,
  emptyText = "Противник не указан",
}: {
  opponents: OpponentView[];
  action?: ReactNode;
  emptyText?: string;
}) {
  const now = useMinuteNow();

  return (
    <WarSection title="Противники" icon={Swords} action={action}>
      {opponents.length === 0 ? (
        <SectionEmpty>{emptyText}</SectionEmpty>
      ) : (
        <div className="grid grid-cols-2 gap-2 px-3 pb-3 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:gap-3 sm:px-4 sm:pb-4">
          {opponents.map((opponent) => (
            <OpponentTile key={opponent.key} opponent={opponent} now={now} />
          ))}
        </div>
      )}
    </WarSection>
  );
}

export function WarOpponentsLive({
  initialState,
  warStartedAt,
  isAdmin,
}: {
  initialState: WarOpponentsState;
  warStartedAt: string | null;
  isAdmin: boolean;
}) {
  const [state, setState] = useState(initialState);

  async function handleSave(
    primary: { name: string | null; ended: boolean },
    drafts: WarOpponentDraft[],
  ) {
    setState(await saveWarOpponents(primary, drafts));
  }

  const opponents: OpponentView[] = [
    ...(state.primary.name
      ? [
          {
            key: "primary",
            name: state.primary.name,
            startedAt: warStartedAt,
            endedAt: state.primary.endedAt,
            status: state.primary.endedAt
              ? ("ended" as const)
              : ("active" as const),
          },
        ]
      : []),
    ...state.opponents.map((opponent) => ({
      key: String(opponent.id),
      name: opponent.name,
      startedAt: opponent.startedAt,
      endedAt: opponent.endedAt,
      status: opponent.endedAt ? ("ended" as const) : ("active" as const),
    })),
  ];

  const action = isAdmin ? (
    <WarOpponentsDialog
      state={state}
      warStartedAt={warStartedAt}
      onSave={handleSave}
      trigger={
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Pencil />
          {opponents.length ? "Изменить" : "Указать"}
        </Button>
      }
    />
  ) : null;

  return <WarOpponentsCard opponents={opponents} action={action} />;
}
