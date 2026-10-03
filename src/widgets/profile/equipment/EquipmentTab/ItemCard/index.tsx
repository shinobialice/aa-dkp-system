import type { UserEquipment } from "@/actions/getUserEquipment";
import type { GearItem } from "../../itemsData";
import { GearItemIcon } from "../../GearItemIcon";
import { ItemStats } from "../../ItemStats";
import {
  getSealGradeLabel,
  getSealGradeColor,
} from "@/widgets/profile/seals/sealsData";
import { CUBE_ELIGIBLE_SLOTS } from "../slotLayout";
import ItemDetails from "./ItemDetails";
import SetProgress from "./SetProgress";

type Props = {
  slotKey: string;
  item: UserEquipment;
  gearItem: GearItem;
  equipment: UserEquipment[];
};

export default function ItemCard({
  slotKey,
  item,
  gearItem,
  equipment,
}: Props) {
  const gradeColor = getSealGradeColor(item.grade) ?? undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <GearItemIcon item={gearItem} grade={item.grade} size={40} />
        <div className="min-w-0">
          <div className="text-xs" style={{ color: gradeColor }}>
            {getSealGradeLabel(item.grade)} предмет
          </div>
          <div className="text-sm font-semibold" style={{ color: gradeColor }}>
            {item.enchant > 0 && `+${item.enchant} `}
            {gearItem.name}
          </div>
        </div>
      </div>

      {CUBE_ELIGIBLE_SLOTS.has(slotKey) && (
        <div className="text-xs text-muted-foreground/70">
          Защита от доп. урона оружия Lv.
          {item.extra_protection}
        </div>
      )}

      <div className="border-t border-border" />

      <ItemStats
        itemId={gearItem.id}
        grade={item.grade}
        enchant={item.enchant}
        bare
      />

      <ItemDetails slotKey={slotKey} item={item} divided />

      <SetProgress
        itemId={gearItem.id}
        runeId={item.rune_id}
        equipment={equipment}
      />
    </div>
  );
}
