"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Badge } from "@/shared/ui/badge";
import { getRaidsByDay, type DailyRaidStat } from "@/actions/guildStats";

function getMoscowTodayISO(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

function formatTime(startDate: string): string {
  return startDate.slice(11, 16);
}

export default function DailyRaidsCard({
  initialDate,
  initialData,
}: {
  initialDate?: string;
  initialData?: DailyRaidStat[];
}) {
  const [date, setDate] = useState(initialDate ?? getMoscowTodayISO());
  const [raids, setRaids] = useState<DailyRaidStat[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const skipNextFetch = useRef(!!initialData);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    setLoading(true);
    getRaidsByDay(date)
      .then(setRaids)
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-2 xl:flex-row xl:items-center xl:justify-between">
        <CardTitle className="text-base">Рейды за день</CardTitle>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-[150px]"
        />
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <p className="text-muted-foreground text-sm py-8 text-center">
            Загрузка...
          </p>
        ) : raids.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">
            Рейдов в этот день не было
          </p>
        ) : (
          <div className="max-h-[200px] overflow-y-auto space-y-2">
            {raids.map((raid) => (
              <div
                key={raid.id}
                className="flex items-center justify-between gap-2 border rounded-md px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground shrink-0">
                    {formatTime(raid.start_date)}
                  </span>
                  <Badge
                    variant={raid.type === "Прайм" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {raid.type}
                  </Badge>
                  <span className="truncate">
                    {raid.bosses.length > 0
                      ? raid.bosses.join(", ")
                      : "Без боссов"}
                  </span>
                </div>
                <span className="shrink-0 font-medium">
                  {raid.attendeeCount}
                  {raid.activeUserCount ? ` / ${raid.activeUserCount}` : ""}{" "}
                  чел.
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
