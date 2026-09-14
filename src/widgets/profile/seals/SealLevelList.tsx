"use client";

import { SEAL_LEVEL_STATS } from "./sealLevelsData";
import {
  LEVELS_PER_GRADE,
  getSealGradeColor,
  getSealGradeForLevel,
  getSealGradeLabel,
} from "./sealsData";

function formatStatValue(value: number, isPercent: boolean): string {
  const sign = value > 0 ? "+" : "";
  const rounded = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  return `${sign}${rounded}${isPercent ? "%" : ""}`;
}

type Props = {
  sealName: string;
  level: number;
  onSelectLevel?: (level: number) => void;
};

// Список всех уровней печати (1-144, по 12 на каждую редкость), кликабельный
// в режиме редактирования: клик по строке выбирает "прокачано до этого
// уровня", всё до неё подсвечивается как достигнутое. Текст строки красится
// в цвет её редкости (как aa-grade-N на archa.ge), непройденные уровни —
// той же редкости, но приглушены.
export default function SealLevelList({
  sealName,
  level,
  onSelectLevel,
}: Props) {
  const rows = SEAL_LEVEL_STATS[sealName] ?? [];
  const editable = !!onSelectLevel;

  return (
    <div className="max-h-[420px] overflow-y-auto rounded-md border">
      {rows.map((row) => {
        const grade = getSealGradeForLevel(row.level);
        const gradeColor = getSealGradeColor(grade);
        const isFirstOfGrade = (row.level - 1) % LEVELS_PER_GRADE === 0;
        const achieved = row.level <= level;
        const isCurrent = row.level === level;
        return (
          <div key={row.level}>
            {isFirstOfGrade && (
              <div
                className="sticky top-0 border-y bg-muted/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm"
                style={{ color: gradeColor ?? undefined }}
              >
                {getSealGradeLabel(grade)}
              </div>
            )}
            <div
              role={editable ? "button" : undefined}
              tabIndex={editable ? 0 : undefined}
              onClick={editable ? () => onSelectLevel(row.level) : undefined}
              className={`flex w-full items-center justify-between gap-3 px-3 py-1.5 text-sm ${
                editable ? "cursor-pointer hover:bg-accent" : ""
              } ${isCurrent ? "bg-accent font-semibold" : ""}`}
              style={{
                color: gradeColor ?? undefined,
                opacity: achieved ? 1 : 0.45,
              }}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="w-8 shrink-0 tabular-nums text-xs text-muted-foreground">
                  {row.level}
                </span>
                <span className="truncate">{row.stat}</span>
              </span>
              <span className="shrink-0 tabular-nums">
                {formatStatValue(row.value, row.isPercent)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
