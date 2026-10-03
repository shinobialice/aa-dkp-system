import { ShoppingCart } from "lucide-react";
import type { PeriodBuyerEntry } from "@/actions/warEconomy";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import MeterBar from "./MeterBar";
import PlaceNumber from "./PlaceNumber";
import { SCROLL_LIST } from "./warModel";
import WarSection from "./WarSection";
import WarUserLink from "./WarUserLink";

type Props = {
  buyers: PeriodBuyerEntry[];
};

export default function WarBuyersCard({ buyers }: Props) {
  const max = Math.max(1, ...buyers.map((buyer) => buyer.totalSpent));

  return (
    <WarSection
      title="Топ покупателей"
      icon={ShoppingCart}
      empty={buyers.length === 0 ? "Покупок за период пока нет" : null}
    >
      <ol className={cn(SCROLL_LIST, "max-h-90 px-4 pb-3")}>
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
              {formatNumber(buyer.totalSpent)}
            </span>
            <MeterBar
              percent={(buyer.totalSpent / max) * 100}
              className="col-span-2 col-start-2"
              barClassName="bg-green-500"
            />
          </li>
        ))}
      </ol>
    </WarSection>
  );
}
