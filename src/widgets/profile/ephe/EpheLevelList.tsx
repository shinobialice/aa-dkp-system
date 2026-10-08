import { cn } from "@/shared/lib/tw-merge";
import { getSealGradeColor, getSealGradeLabel } from "../seals/sealsData";
import type { EpheLevelRow } from "./epheSealsData";

type Props = {
  rows: EpheLevelRow[];
  activeLevel: number;
  editable: boolean;
  onSelect: (level: number) => void;
};

export default function EpheLevelList({
  rows,
  activeLevel,
  editable,
  onSelect,
}: Props) {
  return (
    <div className="max-h-150 overflow-y-auto rounded-md border">
      {rows.map((row, index) => {
        const gradeColor = getSealGradeColor(row.grade + 1) ?? undefined;
        const isFirstOfGrade =
          index === 0 || rows[index - 1].grade !== row.grade;
        return (
          <div key={row.level}>
            {isFirstOfGrade && (
              <div
                className="sticky top-0 border-y bg-muted/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm"
                style={{ color: gradeColor }}
              >
                {getSealGradeLabel(row.grade + 1)}
              </div>
            )}
            <div
              role={editable ? "button" : undefined}
              tabIndex={editable ? 0 : undefined}
              onClick={editable ? () => onSelect(row.level) : undefined}
              className={cn(
                "flex w-full items-center justify-between gap-3 px-3 py-1.5 text-sm",
                editable && "cursor-pointer hover:bg-accent",
                row.level === activeLevel && "bg-accent font-semibold",
              )}
              style={{
                color: gradeColor,
                opacity: row.level <= activeLevel ? 1 : 0.45,
              }}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="w-8 shrink-0 tabular-nums text-xs text-muted-foreground">
                  {row.level}
                </span>
                <span className="truncate">
                  {row.type === "improvement" ? "Улучшение ячейки" : row.stat}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">
                {row.type === "improvement" ? "+0.1" : `+${row.value}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
