"use client";

import { useState } from "react";
import {
  getRaidCandidatesForLoot,
  type RaidCandidate,
} from "@/actions/getRaidCandidatesForLoot";
import { useAsyncData } from "@/hooks/useAsyncData";
import { cn } from "@/shared/lib/tw-merge";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import { parseMoscowISOString } from "@/utils/getMoscowISOString";

type Props = {
  source: string;
  acquiredAt: string | null;
  value: number | null;
  onChange: (raidId: number | null) => void;
};

export default function RaidLinkPicker({
  source,
  acquiredAt,
  value,
  onChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: candidates = [] } = useAsyncData(
    isOpen ? `${source}|${acquiredAt}` : null,
    () => getRaidCandidatesForLoot({ source, acquiredAt }),
  );

  const handleSelect = (raidId: number | null) => {
    onChange(raidId);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full cursor-pointer truncate rounded border px-2 py-1 text-left"
        >
          {pickerLabel(value, candidates)}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-72 w-85 overflow-y-auto p-1"
        align="start"
      >
        <button
          type="button"
          className="w-full cursor-pointer rounded px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent"
          onClick={() => handleSelect(null)}
        >
          Без привязки
        </button>
        {candidates.length === 0 && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            Рейды в этот день не найдены
          </div>
        )}
        {candidates.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            onClick={() => handleSelect(candidate.id)}
            className={cn(
              "flex w-full cursor-pointer items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent",
              value === candidate.id && "bg-accent",
            )}
          >
            <span>{raidLabel(candidate)}</span>
            {candidate.matchesBoss && (
              <span className="shrink-0 text-xs text-muted-foreground">
                по боссу
              </span>
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function pickerLabel(value: number | null, candidates: RaidCandidate[]) {
  if (!value) return "Без привязки";
  const selected = candidates.find((candidate) => candidate.id === value);
  return selected ? raidLabel(selected) : `Рейд #${value}`;
}

function raidLabel(raid: RaidCandidate) {
  const date = raid.start_date
    ? parseMoscowISOString(raid.start_date).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Moscow",
      })
    : "";
  return [date, raid.type, raid.bossNames.join(", ")]
    .filter(Boolean)
    .join(" · ");
}
