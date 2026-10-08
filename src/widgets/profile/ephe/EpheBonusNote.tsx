import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "../equipment/itemsData";
import { GAME_ITEM_LEVELS } from "../equipment/itemsData/gameItemLevels";
import {
  EPHE_SLOT_TRACK,
  EPHE_TRACK_PERCENT_CATEGORY,
  getEpheEffectiveness,
  getEphePercentBonus,
} from "./epheSealsData";

type Props = {
  eq: UserEquipment;
};

export default function EpheBonusNote({ eq }: Props) {
  const track = EPHE_SLOT_TRACK[eq.slot];
  const category = EPHE_TRACK_PERCENT_CATEGORY[track];
  const gearItem = findGearItem(eq.slot, eq.item_name);
  if (!category || !gearItem) return null;

  const effectiveness = getEpheEffectiveness(track, eq.ephe_seal_level);
  const percent =
    effectiveness > 0
      ? getEphePercentBonus(category, gearItem.id, effectiveness)
      : 0;

  return (
    <span className="text-muted-foreground">
      {" "}
      · эффективность {effectiveness.toFixed(1)} · бонус +{percent.toFixed(2)}%
      (уровень предмета {GAME_ITEM_LEVELS[gearItem.id]})
    </span>
  );
}
