import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, ScrollArea } from "@/shared/ui";
import type { PeriodMembershipChanges } from "@/actions/warActions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
  });
}

// Кто пришёл в гильдию и кто ушёл за период — реальные joined_at/inactive_since
// с "user", не привязано к режиму (вар/фришка).
export default function WarMembershipCard({
  changes,
}: {
  changes: PeriodMembershipChanges;
}) {
  const { joined, left } = changes;
  const isEmpty = joined.length === 0 && left.length === 0;

  return (
    <Card className="gap-3 py-4">
      <CardHeader className="flex flex-row items-center gap-2 px-4">
        <Users className="size-4 text-muted-foreground" />
        <CardTitle className="text-sm font-semibold">Состав гильдии</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {isEmpty ? (
          <p className="text-sm text-muted-foreground">Без изменений</p>
        ) : (
          <ScrollArea className="h-64 pr-3">
            <div className="space-y-3">
              {joined.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium text-primary">
                    Пришли ({joined.length})
                  </p>
                  <div className="space-y-1">
                    {joined.map((m) => (
                      <div
                        key={m.userId}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="min-w-0 truncate">{m.username}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDate(m.at)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {left.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium text-destructive">
                    Ушли ({left.length})
                  </p>
                  <div className="space-y-1">
                    {left.map((m) => (
                      <div
                        key={m.userId}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="min-w-0 truncate">{m.username}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDate(m.at)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
