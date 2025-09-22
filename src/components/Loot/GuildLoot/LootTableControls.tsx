import { Button } from "@/components/ui/button";

export function LootTableControls({
  month,
  year,
  onMonthChange,
  onYearChange,
  onAddClick,
  label = "Добавить",
}: {
  month: number;
  year: number;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
  onAddClick: () => void;
  label?: string;
}) {
  return (
    <div className="flex gap-4 items-center">
      <select
        value={month}
        onChange={(e) => onMonthChange(parseInt(e.target.value))}
        className="border rounded px-2 py-1"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>
            {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        className="border rounded px-2 py-1"
      >
        {[2024, 2025, 2026].map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <Button className="cursor-pointer" onClick={onAddClick}>
        {label}
      </Button>
    </div>
  );
}
