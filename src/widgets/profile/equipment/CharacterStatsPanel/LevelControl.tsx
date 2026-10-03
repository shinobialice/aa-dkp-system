import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui";

import { LEVELS } from "./levelStyle";
import LevelDigits from "./LevelDigits";

export default function LevelControl({
  level,
  canEdit,
  editing,
  disabled,
  onEditingChange,
  onChange,
}: {
  level: number;
  canEdit: boolean;
  editing: boolean;
  disabled: boolean;
  onEditingChange: (editing: boolean) => void;
  onChange: (value: string) => void;
}) {
  if (!canEdit) return <LevelDigits level={level} />;
  if (!editing) {
    return (
      <button
        type="button"
        className="cursor-pointer"
        onClick={() => onEditingChange(true)}
      >
        <LevelDigits level={level} />
      </button>
    );
  }

  return (
    <Select
      value={String(level)}
      onValueChange={(value) => {
        onChange(value);
        onEditingChange(false);
      }}
      open={editing}
      onOpenChange={onEditingChange}
      disabled={disabled}
    >
      <SelectTrigger
        size="sm"
        className="h-6 w-auto shrink-0 cursor-pointer justify-center border-none bg-transparent px-1 shadow-none"
      >
        <SelectValue>
          <LevelDigits level={level} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LEVELS.map((n) => (
          <SelectItem key={n} value={String(n)}>
            <LevelDigits level={n} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
