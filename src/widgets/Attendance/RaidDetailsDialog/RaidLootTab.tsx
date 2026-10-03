import type { RaidDetailsLoot } from "@/actions/getRaidById";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";

type Props = {
  loot: RaidDetailsLoot[];
};

export default function RaidLootTab({ loot }: Props) {
  if (loot.length === 0) {
    return (
      <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        Лут к этому рейду не привязан
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y rounded-lg border">
      {loot.map((item) => (
        <li key={item.id} className="flex items-center gap-3 px-3 py-2">
          <LootIcon
            itemName={item.itemType.name}
            iconUrl={item.itemType.icon_url}
            grade={item.itemType.grade}
            size={32}
          />
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate font-medium">
              {item.itemType.name}
              {item.quantity > 1 && (
                <span className="text-muted-foreground">
                  {" "}
                  × {item.quantity}
                </span>
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              {item.status ?? "—"}
              {item.sold_to && ` · ${item.sold_to}`}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
