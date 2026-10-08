import {
  MAX_CHARACTER_LEVEL,
  MIN_CHARACTER_LEVEL,
} from "@/widgets/profile/equipment/characterLevel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

type Props = {
  value: number;
  onChange: (level: number) => void;
};

const LEVELS = Array.from(
  { length: MAX_CHARACTER_LEVEL - MIN_CHARACTER_LEVEL + 1 },
  (_, index) => MIN_CHARACTER_LEVEL + index,
);

export default function LevelSelect({ value, onChange }: Props) {
  return (
    <Select
      value={String(value)}
      onValueChange={(next) => onChange(Number(next))}
    >
      <SelectTrigger
        size="sm"
        aria-label="Уровень"
        className="w-auto cursor-pointer"
      >
        <span className="text-muted-foreground">ур.</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LEVELS.map((level) => (
          <SelectItem key={level} value={String(level)}>
            {level}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
