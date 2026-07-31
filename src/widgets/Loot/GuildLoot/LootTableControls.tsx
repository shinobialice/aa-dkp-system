import { Button, Label } from "@/shared/ui";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { getYearOptions } from "@/utils/getYearOptions";

export function LootTableControls({
  isAdmin,
  month,
  year,
  onMonthChange,
  onYearChange,
  onAddClick,
  label = "Добавить",
}: {
  isAdmin: boolean;
  month: number;
  year: number;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
  onAddClick: () => void;
  label?: string;
}) {
  return (
    <div className="flex gap-4 items-center">
      {isAdmin && (
        <Button className="cursor-pointer" onClick={onAddClick}>
          {label}
        </Button>
      )}

      <Label>Месяц:</Label>
      <Select
        value={month.toString()}
        onValueChange={(value) => onMonthChange(+value)}
      >
        <SelectTrigger className="border rounded px-2 py-1 w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <SelectItem key={m} value={m.toString()}>
              {new Date(0, m - 1).toLocaleString("ru-RU", { month: "long" })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Год:</Label>
      <Select
        value={year.toString()}
        onValueChange={(value) => onYearChange(+value)}
      >
        <SelectTrigger className="border rounded px-2 py-1 w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {getYearOptions().map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
