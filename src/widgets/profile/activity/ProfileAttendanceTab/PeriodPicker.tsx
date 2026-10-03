import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { MONTH_NAMES } from "@/shared/config/months";

type Props = {
  month: number;
  year: number;
  years: number[];
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
};

export default function PeriodPicker({
  month,
  year,
  years,
  onMonthChange,
  onYearChange,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={String(month)}
        onValueChange={(value) => onMonthChange(Number(value))}
      >
        <SelectTrigger className="min-w-30 cursor-pointer" aria-label="Месяц">
          <SelectValue>{MONTH_NAMES[month]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {MONTH_NAMES.map((name, index) => (
            <SelectItem value={String(index)} key={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(year)}
        onValueChange={(value) => onYearChange(Number(value))}
      >
        <SelectTrigger className="min-w-22 cursor-pointer" aria-label="Год">
          <SelectValue>{year}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {years.map((option) => (
            <SelectItem value={String(option)} key={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
