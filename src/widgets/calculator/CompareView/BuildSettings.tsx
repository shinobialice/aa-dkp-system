import {
  CHARACTER_BUFFS,
  type SelectedBuffs,
} from "@/widgets/profile/equipment/characterBuffs";
import CharacterBuffsDialog from "@/widgets/profile/equipment/CharacterStatsPanel/CharacterBuffsDialog";
import BuildExtras from "../BuildExtras";
import ClassSelect from "../ClassSelect";
import LevelSelect from "../LevelSelect";
import type { CalculatorBuild } from "../calculatorModel";

type Props = {
  build: CalculatorBuild;
  onUpdate: (patch: Partial<CalculatorBuild>) => void;
};

export default function BuildSettings({ build, onUpdate }: Props) {
  const handleBuffsSave = async (buffs: SelectedBuffs) => onUpdate({ buffs });

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <ClassSelect
        value={build.roleClass}
        onChange={(roleClass) => onUpdate({ roleClass })}
      />
      <LevelSelect
        value={build.level}
        onChange={(level) => onUpdate({ level })}
      />
      <span className="flex items-center gap-1.5 text-muted-foreground">
        Баффы: {Object.keys(build.buffs).length}
        <CharacterBuffsDialog
          buffs={build.buffs}
          choices={CHARACTER_BUFFS}
          onSave={handleBuffsSave}
        />
      </span>
      <BuildExtras build={build} onUpdate={onUpdate} />
    </div>
  );
}
