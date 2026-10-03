import type { ReactNode } from "react";
import type { UserEquipment } from "@/actions/getUserEquipment";
import {
  getSealGradeLabel,
  getSealGradeColor,
} from "@/widgets/profile/seals/sealsData";
import type { EquipmentSlot } from "../equipmentData";
import { findGearItem } from "../itemsData";
import { findRune } from "../itemsData/runes";
import { LIST_GROUPS } from "./slotLayout";

type Props = {
  equipmentBySlot: Record<string, UserEquipment | undefined>;
  renderSlot: (slot: EquipmentSlot) => ReactNode;
};

export default function SlotList({ equipmentBySlot, renderSlot }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {LIST_GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground">
            {group.title}
          </span>
          <div className="flex flex-col divide-y overflow-hidden rounded-xl border">
            {group.slots.map((slot) => (
              <div
                key={slot.key}
                className="flex items-center gap-3 px-2.5 py-2"
              >
                {renderSlot(slot)}
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="text-2xs text-muted-foreground">
                    {slot.label}
                  </span>
                  <SlotSummary
                    slotKey={slot.key}
                    item={equipmentBySlot[slot.key]}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SlotSummary({
  slotKey,
  item,
}: {
  slotKey: string;
  item: UserEquipment | undefined;
}) {
  if (!item?.item_name) {
    return <span className="text-sm text-muted-foreground">Пусто</span>;
  }

  const gear = findGearItem(slotKey, item.item_name);
  const rune = item.rune_id ? findRune(item.rune_id) : undefined;

  return (
    <>
      <span
        className="text-sm font-semibold"
        style={{ color: getSealGradeColor(item.grade) ?? undefined }}
      >
        {item.enchant > 0 && `+${item.enchant} `}
        {gear?.name ?? item.item_name}
      </span>
      <span className="text-2xs text-muted-foreground">
        {getSealGradeLabel(item.grade)}
        {rune && ` · ${rune.name}`}
      </span>
    </>
  );
}
