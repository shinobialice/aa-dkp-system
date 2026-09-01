import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, ScrollArea } from "@/shared/ui";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import type { PeriodDropEntry } from "@/actions/warActions";

// Полный список того, что выпало с боссов за период — с иконкой и рамкой
// качества предмета (переиспользуем LootIcon, как в LootRawTable.tsx), не
// только топ-N: показываем всё, что реально выпало, и по сколько штук.
export default function WarDropsCard({ rows }: { rows: PeriodDropEntry[] }) {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="flex flex-row items-center gap-2 px-4">
        <Package className="size-4 text-muted-foreground" />
        <CardTitle className="text-sm font-semibold">
          Выпавшие предметы
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет данных</p>
        ) : (
          <ScrollArea className="h-64 pr-3">
            <div className="space-y-2">
              {rows.map((row) => (
                <div key={row.itemName} className="flex items-center gap-2">
                  <LootIcon
                    itemName={row.itemName}
                    iconUrl={row.iconUrl}
                    grade={row.grade}
                    size={30}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {row.itemName}
                  </span>
                  <span className="shrink-0 text-sm font-medium tabular-nums">
                    {row.quantity}
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
