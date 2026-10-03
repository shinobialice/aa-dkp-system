import type { UnlinkedLootCandidate } from "@/actions/getUnlinkedLootCandidates";
import { Checkbox } from "@/shared/ui";
import type { IdFlags } from "../eventFormModel";
import LootLine from "./LootLine";

type Props = {
  items: UnlinkedLootCandidate[];
  checkedIds: IdFlags;
  onToggle: (id: number) => void;
};

export default function UnlinkedLootPicker({
  items,
  checkedIds,
  onToggle,
}: Props) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">
        Непривязанный лут за этот день
      </span>
      <div className="max-h-48 divide-y overflow-y-auto rounded-lg border">
        {items.map((item) => (
          <label
            key={item.id}
            htmlFor={`link-loot-${item.id}`}
            className="flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-sm hover:bg-muted/60"
          >
            <Checkbox
              className="cursor-pointer"
              id={`link-loot-${item.id}`}
              checked={!!checkedIds[item.id]}
              onCheckedChange={() => onToggle(item.id)}
            />
            <LootLine itemType={item.itemType} quantity={item.quantity} />
          </label>
        ))}
      </div>
    </div>
  );
}
