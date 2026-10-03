"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, Skeleton } from "@/shared/ui";
import { classColors } from "@/widgets/MembersTable/classStyles";
import type getStats from "@/actions/getStats";

type Stats = Awaited<ReturnType<typeof getStats>>;

export default function GuildComposition({ stats }: { stats: Stats | null }) {
  const roles = stats
    ? [
        { name: "ДД", count: stats.dds, color: "#f97316" },
        { name: "Хилы", count: stats.healers, color: classColors["Хил"] },
        {
          name: "Тактики",
          count: stats.tacticians,
          color: classColors["Тактик"],
        },
        { name: "Барды", count: stats.bards, color: classColors["Бард"] },
        { name: "Танцоры", count: stats.dancers, color: classColors["Танцор"] },
      ]
    : [];
  const total = stats?.activePlayers ?? 0;

  return (
    <Card className="gap-3 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h2 className="font-semibold">Состав гильдии</h2>
          {stats && (
            <span className="text-sm text-muted-foreground">
              {total} активных
            </span>
          )}
        </div>
        <Link
          href="/members"
          className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
        >
          Участники
          <ChevronRight className="size-4" />
        </Link>
      </div>

      {stats ? (
        <>
          <div className="flex h-3 gap-0.5" aria-hidden>
            {roles
              .filter((role) => role.count > 0)
              .map((role) => (
                <span
                  key={role.name}
                  className="block min-w-1 rounded-sm"
                  style={{
                    flex: `${role.count} 0 0`,
                    backgroundColor: role.color,
                  }}
                />
              ))}
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-5">
            {roles.map((role) => (
              <li key={role.name} className="flex items-center gap-1.5 text-sm">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: role.color }}
                />
                <span className="flex-1 sm:flex-none">{role.name}</span>
                <span className="font-semibold tabular-nums">{role.count}</span>
                {total > 0 && (
                  <span className="hidden text-muted-foreground tabular-nums sm:inline">
                    {Math.round((role.count / total) * 100)}%
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Skeleton className="h-12 w-full" />
      )}
    </Card>
  );
}
