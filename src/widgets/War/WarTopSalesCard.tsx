import { Tag } from "lucide-react";
import type { PeriodSaleEntry } from "@/actions/warEconomy";
import { formatNumber, plural } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import { SCROLL_LIST } from "./warModel";
import WarSection from "./WarSection";
import WarUserLink from "./WarUserLink";

const COLUMNS = "sm:grid-cols-[minmax(0,1fr)_160px_104px]";

type Props = {
  sales: PeriodSaleEntry[];
};

export default function WarTopSalesCard({ sales }: Props) {
  return (
    <WarSection
      title="Крупные продажи"
      icon={Tag}
      empty={sales.length === 0 ? "Продаж за период пока нет" : null}
      action={
        sales.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {sales.length}{" "}
            {plural(sales.length, "продажа", "продажи", "продаж")}
          </span>
        )
      }
    >
      <div
        className={cn(
          SCROLL_LIST,
          "max-h-120 rounded-b-xl border-t sm:border-t-0",
        )}
      >
        <div
          className={cn(
            "sticky top-0 z-10 hidden items-center gap-3 border-y bg-muted px-4 py-2 text-xs font-medium text-muted-foreground sm:grid",
            COLUMNS,
          )}
        >
          <span>Предмет</span>
          <span>Кому</span>
          <span className="text-right">Цена</span>
        </div>
        <ul>
          {sales.map((sale, index) => (
            <li
              key={index}
              className={cn(
                "grid min-h-13 grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-x-2.5 border-b border-border/60 px-4 py-1.5 last:border-b-0 sm:gap-3",
                COLUMNS,
              )}
            >
              <div className="contents sm:flex sm:min-w-0 sm:items-center sm:gap-2.5">
                <LootIcon
                  itemName={sale.itemName}
                  iconUrl={sale.iconUrl}
                  grade={sale.grade}
                  size={34}
                />
                <div className="min-w-0">
                  <span className="block truncate font-medium">
                    {sale.itemName}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground sm:hidden">
                    {sale.buyerUsername ?? "неизвестно"}
                  </span>
                </div>
              </div>
              <div className="hidden min-w-0 sm:block">
                <SaleBuyer sale={sale} />
              </div>
              <span className="text-right font-semibold tabular-nums">
                {formatNumber(sale.price)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </WarSection>
  );
}

function SaleBuyer({ sale }: { sale: PeriodSaleEntry }) {
  if (sale.buyerUserId && sale.buyerUsername) {
    return <WarUserLink userId={sale.buyerUserId} name={sale.buyerUsername} />;
  }
  return (
    <span className="inline-flex h-5.5 max-w-full items-center truncate rounded-full bg-muted px-2 text-xs font-medium text-muted-foreground">
      {sale.buyerUsername ?? "неизвестно"}
    </span>
  );
}
