import { ShoppingBag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, ScrollArea } from "@/shared/ui";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import type { PeriodSaleEntry } from "@/actions/warActions";

function formatNum(n: number): string {
  return n.toLocaleString("ru-RU");
}

// Топ ПРОДАЖ — самые дорогие отдельные сделки за период (предмет + цена +
// кому продали), не агрегат по покупателю. Фикс. высота + скролл — как у
// остальных карточек в этой сетке.
export default function WarTopSalesCard({ rows }: { rows: PeriodSaleEntry[] }) {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="flex flex-row items-center gap-2 px-4">
        <ShoppingBag className="size-4 text-muted-foreground" />
        <CardTitle className="text-sm font-semibold">Топ продаж</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет данных</p>
        ) : (
          <ScrollArea className="h-64 pr-3">
            <div className="space-y-2">
              {rows.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <LootIcon
                    itemName={row.itemName}
                    iconUrl={row.iconUrl}
                    grade={row.grade}
                    size={30}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{row.itemName}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <ArrowRight className="size-3 shrink-0" />
                      {row.buyerUsername ?? "неизвестно"}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatNum(row.price)}
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
