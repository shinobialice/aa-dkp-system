import { CLASS_ORDER } from "@/shared/config/classes";
import {
  FRAME_RANK_OPTIONS,
  type FrameUnlockType,
} from "@/shared/config/profileStyle";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import type { FrameCondition } from "./frameConditionModel";

type Props = {
  unlockType: FrameUnlockType;
  condition: FrameCondition;
  onChange: (patch: Partial<FrameCondition>) => void;
};

export default function UnlockValueField({
  unlockType,
  condition,
  onChange,
}: Props) {
  if (unlockType === "class") {
    return (
      <OptionSelect
        label="Класс"
        value={condition.unlockClass}
        options={CLASS_ORDER.map((cls) => ({ value: cls, label: cls }))}
        onChange={(unlockClass) => onChange({ unlockClass })}
      />
    );
  }
  if (unlockType === "rank") {
    return (
      <OptionSelect
        label="Ранг не ниже"
        value={condition.rankKills}
        options={FRAME_RANK_OPTIONS.map((rank) => ({
          value: String(rank.minKills),
          label: rank.name,
        }))}
        onChange={(rankKills) => onChange({ rankKills })}
      />
    );
  }
  if (unlockType === "tenure") {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="frame-years">Лет в гильдии</Label>
        <Input
          id="frame-years"
          type="number"
          min={1}
          value={condition.years}
          onChange={(event) => onChange({ years: event.target.value })}
          className="w-24"
        />
      </div>
    );
  }
  return null;
}

function OptionSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-40 cursor-pointer" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
