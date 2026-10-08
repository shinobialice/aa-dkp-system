import type { UserEquipment } from "@/actions/getUserEquipment";
import { Button } from "@/shared/ui";
import EpheBonusNote from "@/widgets/profile/ephe/EpheBonusNote";
import EpheLevelList from "@/widgets/profile/ephe/EpheLevelList";
import {
  EPHE_SLOT_TRACK,
  EPHE_TRACK_MAX_LEVEL,
  getEpheTrackLevels,
} from "@/widgets/profile/ephe/epheSealsData";
import { getEquipmentSlot } from "@/widgets/profile/equipment/equipmentData";

type Props = {
  slot: string;
  item: UserEquipment | undefined;
  onLevelSelect: (level: number) => void;
};

export default function EpheSlotLevels({ slot, item, onLevelSelect }: Props) {
  const slotLabel = getEquipmentSlot(slot)?.label;
  const track = EPHE_SLOT_TRACK[slot];

  if (!item) {
    return (
      <div className="flex h-full min-h-40 items-center justify-center px-6 text-center text-sm text-muted-foreground">
        В ячейке «{slotLabel}» нет предмета. Сначала наденьте его на куклу
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm">
          <span className="font-semibold">{slotLabel}</span>
          <span className="text-muted-foreground">
            {" "}
            — выбрано до уровня {item.ephe_seal_level} /{" "}
            {EPHE_TRACK_MAX_LEVEL[track]}
          </span>
          <EpheBonusNote eq={item} />
        </div>
        {item.ephe_seal_level > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => onLevelSelect(0)}
          >
            Сбросить ячейку
          </Button>
        )}
      </div>
      <EpheLevelList
        rows={getEpheTrackLevels(track)}
        activeLevel={item.ephe_seal_level}
        editable
        onSelect={onLevelSelect}
      />
    </div>
  );
}
