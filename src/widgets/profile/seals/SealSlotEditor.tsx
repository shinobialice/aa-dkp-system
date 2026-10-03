import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import SealLevelList from "./SealLevelList";
import SealOptionLabel from "./SealOptionLabel";
import {
  MAX_SEAL_LEVEL,
  SEAL_NAMES,
  getSealGradeForLevel,
  getSealGradeLabel,
} from "./sealsData";

export const NO_SEAL = "Нет";

export type SealSlot = { name: string | null; level: number };

type Props = {
  index: number;
  slot: SealSlot;
  takenNames: string[];
  onNameChange: (value: string) => void;
  onLevelChange: (level: number) => void;
};

export default function SealSlotEditor({
  index,
  slot,
  takenNames,
  onNameChange,
  onLevelChange,
}: Props) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Печать {index + 1}
      </div>
      <Select value={slot.name ?? NO_SEAL} onValueChange={onNameChange}>
        <SelectTrigger className="w-full cursor-pointer">
          <SelectValue placeholder="Не выбрано" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_SEAL}>Нет</SelectItem>
          {SEAL_NAMES.filter((name) => !takenNames.includes(name)).map(
            (name) => (
              <SelectItem key={name} value={name}>
                <SealOptionLabel name={name} />
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
      {slot.name && (
        <div className="space-y-1.5 rounded-lg border p-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span>
              Уровень <span className="font-semibold">{slot.level}</span> —{" "}
              {getSealGradeLabel(getSealGradeForLevel(slot.level))}
            </span>
            <Input
              type="number"
              min={0}
              max={MAX_SEAL_LEVEL}
              value={slot.level}
              onChange={(event) =>
                onLevelChange(
                  Math.max(
                    0,
                    Math.min(MAX_SEAL_LEVEL, Number(event.target.value) || 0),
                  ),
                )
              }
              className="h-8 w-16 text-right"
            />
          </div>
          <div className="space-y-1 text-xs font-medium text-muted-foreground">
            Выбрать по списку уровней
          </div>
          <SealLevelList
            sealName={slot.name}
            level={slot.level}
            onSelectLevel={onLevelChange}
          />
        </div>
      )}
    </div>
  );
}
