import { Package } from "lucide-react";
import type { PeriodDropEntry } from "@/actions/warEconomy";
import { formatNumber, plural } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import { SCROLL_LIST } from "./warModel";
import WarSection from "./WarSection";

type Props = {
  drops: PeriodDropEntry[];
};

export default function WarDropsCard({ drops }: Props) {
  const totalItems = drops.reduce((sum, drop) => sum + drop.quantity, 0);

  return (
    <WarSection
      title="Выпало с боссов"
      icon={Package}
      empty={drops.length === 0 ? "С боссов пока ничего не выпало" : null}
      action={
        drops.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {formatNumber(totalItems)}{" "}
            {plural(totalItems, "предмет", "предмета", "предметов")} ·{" "}
            {drops.length} {plural(drops.length, "вид", "вида", "видов")}
          </span>
        )
      }
    >
      <ul
        className={cn(
          SCROLL_LIST,
          "grid max-h-75 grid-cols-[repeat(auto-fill,minmax(min(176px,100%),1fr))] gap-2 px-4 pb-4",
        )}
      >
        {drops.map((drop) => (
          <li
            key={drop.itemName}
            title={drop.itemName}
            className="flex min-h-13 items-center gap-2.5 rounded-lg border border-border/60 bg-muted/40 px-2.5 py-2"
          >
            <LootIcon
              itemName={drop.itemName}
              iconUrl={drop.iconUrl}
              grade={drop.grade}
              size={36}
            />
            <span className="line-clamp-2 min-w-0 flex-1 text-sm leading-snug">
              {drop.itemName}
            </span>
            <span className="shrink-0 font-bold tabular-nums">
              ×{formatNumber(drop.quantity)}
            </span>
          </li>
        ))}
      </ul>
    </WarSection>
  );
}
