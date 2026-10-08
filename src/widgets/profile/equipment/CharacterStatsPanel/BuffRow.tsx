import type { UserEquipment } from "@/actions/getUserEquipment";
import { getActiveWeaponBuff } from "../weaponBuffs";
import { getActiveSetBuffs } from "../setBonuses";
import { getActiveQualitySetBuffs } from "../qualitySetBonus";
import {
  buffIconUrl,
  getActiveBuffs,
  type SelectedBuffs,
} from "../characterBuffs";
import type { CharacterBuff } from "../itemsData/buffTypes";
import BuffIcon from "./BuffIcon";
import CharacterBuffsDialog from "./CharacterBuffsDialog";

type Props = {
  equipment: UserEquipment[];
  buffs: SelectedBuffs;
  guildBuffs: SelectedBuffs;
  buffChoices: CharacterBuff[];
  canEdit: boolean;
  onBuffsSave: (buffs: SelectedBuffs) => Promise<void>;
};

export default function BuffRow({
  equipment,
  buffs,
  guildBuffs,
  buffChoices,
  canEdit,
  onBuffsSave,
}: Props) {
  const weaponBuff = getActiveWeaponBuff(equipment);
  const gearBuffs = [
    ...getActiveSetBuffs(equipment),
    ...getActiveQualitySetBuffs(equipment),
    ...(weaponBuff ? [weaponBuff] : []),
  ];
  const characterBuffs = getActiveBuffs({ ...buffs, ...guildBuffs });
  if (gearBuffs.length === 0 && characterBuffs.length === 0 && !canEdit) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {gearBuffs.map((buff, index) => (
        <BuffIcon
          key={index}
          icon={buff.icon}
          title={buff.title}
          description={buff.description}
        />
      ))}
      {characterBuffs.map(({ buff, option }) => (
        <BuffIcon
          key={buff.id}
          icon={buffIconUrl(buff, option)}
          title={`${buff.name}: ${option.label}`}
          description={option.text}
        />
      ))}
      {canEdit && (
        <CharacterBuffsDialog
          buffs={buffs}
          choices={buffChoices}
          onSave={onBuffsSave}
        />
      )}
    </div>
  );
}
