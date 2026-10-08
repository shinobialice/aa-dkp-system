import type { UserEquipment } from "@/actions/getUserEquipment";
import { Badge } from "@/shared/ui";
import {
  getSealGradeLabel,
  getSealGradeColor,
} from "@/widgets/profile/seals/sealsData";
import type { GearItem } from "../itemsData";
import { GearItemIcon } from "../GearItemIcon";
import ItemStats from "../ItemStats";
import { getEpheStatMultipliers } from "@/widgets/profile/ephe/epheSealsBonus";
import ItemDetails from "./ItemCard/ItemDetails";
import { getItemElementLabel } from "../weaponElements";

type Props = {
  slotKey: string;
  item: UserEquipment | undefined;
  gearItem: GearItem | undefined;
};

export default function SlotReadonlyView({ slotKey, item, gearItem }: Props) {
  if (!item?.item_name) {
    return <div className="px-5 py-4 text-sm text-muted-foreground">Пусто</div>;
  }
  const elementLabel = gearItem && getItemElementLabel(gearItem.id, item.grade);

  return (
    <div className="space-y-1.5 overflow-y-auto px-5 py-4">
      {gearItem && (
        <div className="flex items-center gap-2">
          <GearItemIcon item={gearItem} grade={item.grade} size={32} />
          <span
            className="min-w-0 flex-1 truncate text-sm"
            style={{ color: getSealGradeColor(item.grade) ?? undefined }}
          >
            {gearItem.name}
          </span>
        </div>
      )}
      {!gearItem && <div className="text-sm">{item.item_name}</div>}
      <div className="flex gap-1.5">
        <Badge variant="outline">{getSealGradeLabel(item.grade)}</Badge>
        {item.enchant > 0 && <Badge variant="outline">+{item.enchant}</Badge>}
      </div>
      {elementLabel && (
        <div className="text-xs text-muted-foreground/70">{elementLabel}</div>
      )}
      {gearItem && (
        <ItemStats
          itemId={gearItem.id}
          grade={item.grade}
          enchant={item.enchant}
          epheMultipliers={getEpheStatMultipliers(item)}
        />
      )}
      <ItemDetails slotKey={slotKey} item={item} />
    </div>
  );
}
