"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, ScrollArea } from "@/shared/ui";
import { useUpcomingEvents, bossImages, packsLabel } from "@/hooks/useUpcomingEvents";

function formatMinutes(mins: number): string {
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.abs(mins) % 60;
  if (h === 0) return `${m} мин`;
  return `${h} ч ${m} мин`;
}

export default function UpcomingEvents() {
  const events = useUpcomingEvents().slice(0, 10);

  return (
    <ScrollArea className="h-full pr-3">
      <div className="flex flex-col gap-4">
        {events.map((e) => (
          <Card
            key={e.key}
            className={
              "flex-row items-center justify-between gap-4" +
              (e.isNow ? " border-primary bg-muted shadow-md" : " opacity-90")
            }
          >
            <div className="min-w-0 flex-1">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span>
                    {e.boss}
                    {e.boss === "Кириос" &&
                      typeof e.packsNeeded === "number" &&
                      ` (${packsLabel(e.packsNeeded)})`}
                  </span>
                  {e.isNow && <span className="text-primary text-sm">⏱</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div>🕓 {e.time}</div>
                {e.isNow ? (
                  <div className="text-xs text-muted-foreground">
                    До конца: {formatMinutes(e.endsInMin ?? 0)}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Через: {formatMinutes(e.startsInMin ?? 0)}
                  </div>
                )}
              </CardContent>
            </div>
            {bossImages[e.boss] && (
              <Image
                src={bossImages[e.boss]}
                alt={e.boss}
                width={80}
                height={80}
                className="mr-6 shrink-0 rounded-lg object-cover"
              />
            )}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
