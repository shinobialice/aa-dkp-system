import type { RaidDetailsLoot } from "@/actions/getRaidById";
import LootLine from "./LootLine";

type Props = {
  loot: RaidDetailsLoot[];
};

export default function RaidLootList({ loot }: Props) {
  const visibleLoot = loot.filter((item) => item.status !== "Распродано");
  const countLabel = visibleLoot.length > 0 ? ` · ${visibleLoot.length}` : "";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">
        Лут{countLabel}
      </span>
      <RaidLootItems loot={visibleLoot} />
    </div>
  );
}

function RaidLootItems({ loot }: Props) {
  if (loot.length === 0) {
    return (
      <p className="rounded-lg border border-dashed px-3 py-3 text-center text-sm text-muted-foreground">
        Лут не привязан к этому рейду
      </p>
    );
  }

  return (
    <div className="max-h-48 divide-y overflow-y-auto rounded-lg border">
      {loot.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 px-2.5 py-1.5 text-sm"
        >
          <LootLine itemType={item.itemType} quantity={item.quantity} />
        </div>
      ))}
    </div>
  );
}
