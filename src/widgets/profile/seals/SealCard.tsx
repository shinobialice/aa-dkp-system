"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import SealIcon from "./SealIcon";
import SealLevelList from "./SealLevelList";
import { computeSealBonusSummary, formatStatValue } from "./sealBonusSummary";
import {
  MAX_SEAL_LEVEL,
  SEAL_INFO,
  SEAL_ROLE_COLORS,
  getSealGradeColor,
  getSealGradeForLevel,
  getSealGradeLabel,
} from "./sealsData";

const PREVIEW_COUNT = 8;

export default function SealCard({
  name,
  level,
}: {
  name: string;
  level: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const grade = getSealGradeForLevel(level);
  const gradeColor = getSealGradeColor(grade) ?? undefined;
  const info = SEAL_INFO[name as keyof typeof SEAL_INFO];
  const bonuses = computeSealBonusSummary([{ sealName: name, level }]);
  const visible = expanded ? bonuses : bonuses.slice(0, PREVIEW_COUNT);
  const progress = Math.round((level / MAX_SEAL_LEVEL) * 100);

  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-xl border p-3.5">
      <div className="flex items-center gap-2.5">
        <SealIcon grade={grade} size={44} />
        <div className="flex min-w-0 flex-col">
          <span className="text-[15px] font-bold">{name}</span>
          {info && (
            <span className="text-[12.5px] text-muted-foreground">
              {info.playstyle} ·{" "}
              {info.roles.map((role, index) => (
                <span key={role}>
                  {index > 0 && ", "}
                  <span style={{ color: SEAL_ROLE_COLORS[role] }}>{role}</span>
                </span>
              ))}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="flex items-baseline justify-between gap-2 text-[12.5px]">
          <span className="font-semibold" style={{ color: gradeColor }}>
            {getSealGradeLabel(grade)}
          </span>
          <span className="text-muted-foreground">
            ур. <b className="text-foreground">{level}</b> / {MAX_SEAL_LEVEL}
          </span>
        </span>
        <span className="block h-1.5 overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: gradeColor }}
          />
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-foreground/80">
          Даёт сейчас · {bonuses.length}{" "}
          {bonuses.length === 1 ? "бонус" : "бонусов"}
        </span>
        {bonuses.length === 0 ? (
          <span className="text-[12.5px] text-muted-foreground">
            Печать ещё не прокачана
          </span>
        ) : (
          visible.map((bonus) => (
            <div
              key={bonus.stat}
              className="flex justify-between gap-2 text-[12.5px]"
            >
              <span className="min-w-0 text-muted-foreground">
                {bonus.stat}
              </span>
              <span
                className={cn(
                  "shrink-0 font-semibold tabular-nums",
                  bonus.value < 0
                    ? "text-red-700 dark:text-red-400"
                    : "text-green-700 dark:text-green-400",
                )}
              >
                {formatStatValue(bonus.value, bonus.isPercent)}
              </span>
            </div>
          ))
        )}
      </div>

      {expanded && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-foreground/80">
            Бонусы по уровням
          </span>
          <SealLevelList sealName={name} level={level} />
        </div>
      )}

      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
        className="mt-auto flex h-9 cursor-pointer items-center justify-center gap-1 rounded-lg bg-muted text-[12.5px] font-semibold text-foreground/80 transition-colors hover:bg-muted/70"
      >
        {expanded
          ? "Свернуть"
          : bonuses.length > PREVIEW_COUNT
            ? `Ещё ${bonuses.length - PREVIEW_COUNT} · все уровни`
            : "Все уровни"}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>
    </article>
  );
}
