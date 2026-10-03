"use client";

import { Users } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import type { PeriodMembershipChanges } from "@/actions/warMembership";
import WarUserLink from "./WarUserLink";
import SectionEmpty from "./SectionEmpty";
import { formatShortDate, SCROLL_LIST } from "./warModel";
import WarSection from "./WarSection";
import { avatarSrc } from "@/shared/lib/format";

type Tone = "green" | "amber" | "muted";

type MemberRow = {
  key: string;
  userId: number;
  name: string;
  avatarUrl: string | null;
  when: string;
  tone: Tone;
};

const TONE_CLASS: Record<Tone, string> = {
  green: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  muted: "bg-muted text-muted-foreground",
};

function MemberList({ rows, empty }: { rows: MemberRow[]; empty: string }) {
  if (rows.length === 0) return <SectionEmpty>{empty}</SectionEmpty>;
  return (
    <ul className={cn(SCROLL_LIST, "max-h-105 px-2 pb-2.5")}>
      {rows.map((row) => (
        <li
          key={row.key}
          className="flex h-11 items-center gap-2.5 px-2 sm:h-10"
        >
          <Avatar className="size-7 shrink-0 sm:size-6.5">
            <AvatarImage src={avatarSrc(row.name, row.avatarUrl)} alt="" />
            <AvatarFallback className="text-2xs font-semibold text-muted-foreground">
              {row.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <WarUserLink
            userId={row.userId}
            name={row.name}
            className="min-w-0 flex-1"
          />
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
              TONE_CLASS[row.tone],
            )}
          >
            {row.when}
          </span>
        </li>
      ))}
    </ul>
  );
}

type Props = {
  changes: PeriodMembershipChanges;
};

export default function WarMembershipCard({ changes }: Props) {
  const tabs = [
    {
      value: "joined",
      label: "Пришли",
      empty: "Никто не пришёл за период",
      rows: changes.joined.map((member) => ({
        key: `joined-${member.userId}`,
        userId: member.userId,
        name: member.username,
        avatarUrl: member.avatarUrl,
        when: formatShortDate(member.at),
        tone: "green" as const,
      })),
    },
    {
      value: "left",
      label: "Ушли",
      empty: "Никто не ушёл за период",
      rows: changes.left.map((member) => ({
        key: `left-${member.userId}`,
        userId: member.userId,
        name: member.username,
        avatarUrl: member.avatarUrl,
        when: formatShortDate(member.at),
        tone: "muted" as const,
      })),
    },
    {
      value: "afk",
      label: "АФК",
      empty: "Никто не уходил в АФК",
      rows: changes.afk.map((member, index) => ({
        key: `afk-${member.userId}-${index}`,
        userId: member.userId,
        name: member.username,
        avatarUrl: member.avatarUrl,
        when: afkPeriod(member.from, member.to),
        tone: member.to ? ("muted" as const) : ("amber" as const),
      })),
    },
  ];
  const defaultTab = tabs.find((tab) => tab.rows.length > 0)?.value ?? "joined";

  return (
    <WarSection title="Состав за период" icon={Users}>
      <Tabs defaultValue={defaultTab} className="gap-2.5">
        <div className="px-4">
          <TabsList className="grid h-9 w-full grid-cols-3">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="cursor-pointer"
              >
                {tab.label}
                <span className="text-muted-foreground tabular-nums">
                  {tab.rows.length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <MemberList rows={tab.rows} empty={tab.empty} />
          </TabsContent>
        ))}
      </Tabs>
    </WarSection>
  );
}

function afkPeriod(from: string, to: string | null) {
  if (!to) return `с ${formatShortDate(from)}`;
  return `${formatShortDate(from)} — ${formatShortDate(to)}`;
}
