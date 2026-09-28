import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, ScrollArea } from "@/shared/ui";
import WarUserLink from "./WarUserLink";

export type LeaderboardRow = {
  rank: number;
  name: string;
  userId?: number;
  value: string;
  icon?: string;
  iconTitle?: string;
};

// Один общий компонент карточки-топа, переиспользуется для нескольких топов
// (посещаемость/килы/хонор) — различается только источник данных. Фикс.
// высота + скролл — чтобы все карточки в сетке были одной высоты независимо
// от того, сколько в них строк (5 или все 60 участников).
export default function WarLeaderboardCard({
  icon: Icon,
  title,
  rows,
  isMock,
}: {
  icon: LucideIcon;
  title: string;
  rows: LeaderboardRow[];
  isMock?: boolean;
}) {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="flex flex-row items-center gap-2 px-4">
        <Icon className="size-4 text-muted-foreground" />
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {isMock && (
          <span className="ml-auto text-[11px] text-muted-foreground">
            скоро
          </span>
        )}
      </CardHeader>
      <CardContent className="px-4">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет данных</p>
        ) : (
          <ScrollArea className="h-64 pr-3">
            <div className="space-y-1.5">
              {rows.map((row) => (
                <div
                  key={row.rank}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="w-4 shrink-0 text-muted-foreground">
                      {row.rank}
                    </span>
                    {row.icon && (
                      <Image
                        src={row.icon}
                        alt={row.iconTitle ?? ""}
                        title={row.iconTitle}
                        width={24}
                        height={24}
                        className="shrink-0"
                      />
                    )}
                    {row.userId ? (
                      <WarUserLink userId={row.userId} name={row.name} />
                    ) : (
                      <span className="truncate">{row.name}</span>
                    )}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
