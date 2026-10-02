"use client";

import { Coins, Package, ShoppingCart, Tag } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import type {
  PeriodBuyerEntry,
  PeriodDropEntry,
  PeriodIncomeSourceEntry,
  PeriodSaleEntry,
} from "@/actions/warActions";
import WarUserLink from "./WarUserLink";
import {
  MeterBar,
  PlaceNumber,
  SCROLL_LIST,
  SectionEmpty,
  WarSection,
} from "./WarParts";
import { formatNum, formatShare, plural } from "./warModel";

export function WarIncomeSourcesCard({
  sources,
  totalEarned,
}: {
  sources: PeriodIncomeSourceEntry[];
  totalEarned: number;
}) {
  const known = sources.reduce((sum, source) => sum + source.income, 0);
  const rest = totalEarned - known;
  const rows = [
    ...sources.map((source) => ({
      name: source.source,
      income: source.income,
      muted: false,
    })),
    ...(rest > 0 ? [{ name: "Без источника", income: rest, muted: true }] : []),
  ];
  const max = Math.max(1, ...rows.map((row) => row.income));

  return (
    <WarSection
      title="Доход по источникам"
      icon={Coins}
      action={
        totalEarned > 0 && (
          <span className="text-xs text-muted-foreground">
            доля от {formatNum(totalEarned)}
          </span>
        )
      }
    >
      {rows.length === 0 ? (
        <SectionEmpty>Дохода за период пока нет</SectionEmpty>
      ) : (
        <ul className="flex flex-col gap-3 px-4 pb-4 sm:gap-2.5">
          {rows.map((row) => (
            <li
              key={row.name}
              className="grid grid-cols-[minmax(0,1fr)_auto_44px] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[128px_minmax(0,1fr)_104px_44px]"
            >
              <span
                className={cn(
                  "truncate font-medium",
                  row.muted && "text-muted-foreground",
                )}
              >
                {row.name}
              </span>
              <span className="text-right font-semibold tabular-nums">
                {formatNum(row.income)}
              </span>
              <span className="text-right text-xs text-muted-foreground tabular-nums">
                {formatShare(row.income, totalEarned)}
              </span>
              <MeterBar
                percent={(row.income / max) * 100}
                className="col-span-3 h-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:h-2.5"
                barClassName={
                  row.muted ? "bg-muted-foreground/40" : "bg-green-500"
                }
              />
            </li>
          ))}
        </ul>
      )}
    </WarSection>
  );
}

export function WarBuyersCard({ buyers }: { buyers: PeriodBuyerEntry[] }) {
  const max = Math.max(1, ...buyers.map((buyer) => buyer.totalSpent));

  return (
    <WarSection title="Топ покупателей" icon={ShoppingCart}>
      {buyers.length === 0 ? (
        <SectionEmpty>Покупок за период пока нет</SectionEmpty>
      ) : (
        <ol className={cn(SCROLL_LIST, "max-h-[360px] px-4 pb-3")}>
          {buyers.map((buyer, index) => (
            <li
              key={buyer.buyerUserId}
              className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-1 py-1.5"
            >
              <PlaceNumber place={index + 1} />
              <span className="flex min-w-0 items-baseline gap-1.5">
                <WarUserLink
                  userId={buyer.buyerUserId}
                  name={buyer.buyerUsername}
                  className="font-medium"
                />
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {buyer.itemsCount} шт.
                </span>
              </span>
              <span className="font-semibold tabular-nums">
                {formatNum(buyer.totalSpent)}
              </span>
              <MeterBar
                percent={(buyer.totalSpent / max) * 100}
                className="col-span-2 col-start-2"
                barClassName="bg-green-500"
              />
            </li>
          ))}
        </ol>
      )}
    </WarSection>
  );
}

function Buyer({ sale }: { sale: PeriodSaleEntry }) {
  if (sale.buyerUserId && sale.buyerUsername) {
    return <WarUserLink userId={sale.buyerUserId} name={sale.buyerUsername} />;
  }
  return (
    <span className="inline-flex h-[22px] max-w-full items-center truncate rounded-full bg-muted px-2 text-xs font-medium text-muted-foreground">
      {sale.buyerUsername ?? "неизвестно"}
    </span>
  );
}

export function WarTopSalesCard({ sales }: { sales: PeriodSaleEntry[] }) {
  const columns = "sm:grid-cols-[minmax(0,1fr)_160px_104px]";

  return (
    <WarSection
      title="Крупные продажи"
      icon={Tag}
      action={
        sales.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {sales.length}{" "}
            {plural(sales.length, "продажа", "продажи", "продаж")}
          </span>
        )
      }
    >
      {sales.length === 0 ? (
        <SectionEmpty>Продаж за период пока нет</SectionEmpty>
      ) : (
        <div
          className={cn(
            SCROLL_LIST,
            "max-h-[480px] rounded-b-xl border-t sm:border-t-0",
          )}
        >
          <div
            className={cn(
              "sticky top-0 z-10 hidden items-center gap-3 border-y bg-muted px-4 py-2 text-xs font-medium text-muted-foreground sm:grid",
              columns,
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
                  "grid min-h-[52px] grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-x-2.5 border-b border-border/60 px-4 py-1.5 last:border-b-0 sm:gap-3",
                  columns,
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
                  <Buyer sale={sale} />
                </div>
                <span className="text-right font-semibold tabular-nums">
                  {formatNum(sale.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </WarSection>
  );
}

export function WarDropsCard({ drops }: { drops: PeriodDropEntry[] }) {
  const totalItems = drops.reduce((sum, drop) => sum + drop.quantity, 0);

  return (
    <WarSection
      title="Выпало с боссов"
      icon={Package}
      action={
        drops.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {formatNum(totalItems)}{" "}
            {plural(totalItems, "предмет", "предмета", "предметов")} ·{" "}
            {drops.length} {plural(drops.length, "вид", "вида", "видов")}
          </span>
        )
      }
    >
      {drops.length === 0 ? (
        <SectionEmpty>С боссов пока ничего не выпало</SectionEmpty>
      ) : (
        <ul
          className={cn(
            SCROLL_LIST,
            "grid max-h-[300px] grid-cols-[repeat(auto-fill,minmax(min(176px,100%),1fr))] gap-2 px-4 pb-4",
          )}
        >
          {drops.map((drop) => (
            <li
              key={drop.itemName}
              title={drop.itemName}
              className="flex min-h-[52px] items-center gap-2.5 rounded-lg border border-border/60 bg-muted/40 px-2.5 py-2"
            >
              <LootIcon
                itemName={drop.itemName}
                iconUrl={drop.iconUrl}
                grade={drop.grade}
                size={36}
              />
              <span className="line-clamp-2 min-w-0 flex-1 text-[13px] leading-snug">
                {drop.itemName}
              </span>
              <span className="shrink-0 font-bold tabular-nums">
                ×{formatNum(drop.quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </WarSection>
  );
}
