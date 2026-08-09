"use client";

import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import { getRaidCandidatesForLoot } from "@/actions/getRaidCandidatesForLoot";
import { parseMoscowISOString } from "@/utils/getMoscowISOString";

type RaidCandidate = {
  id: number;
  type: string;
  start_date: string;
  bossNames: string[];
  matchesBoss: boolean;
};

export function formatRaidLabel(raid: {
  type: string;
  start_date: string;
  bossNames?: string[];
}) {
  const dateStr = parseMoscowISOString(raid.start_date).toLocaleString(
    "ru-RU",
    {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Moscow",
    },
  );
  const bosses = raid.bossNames?.filter(Boolean).join(", ") ?? "";
  return [dateStr, raid.type, bosses].filter(Boolean).join(" · ");
}

export function RaidLinkPicker({
  source,
  acquiredAt,
  value,
  initialLabel,
  onChange,
}: {
  source: string;
  acquiredAt: string | null;
  value: number | null;
  initialLabel?: string | null;
  onChange: (raidId: number | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [candidates, setCandidates] = useState<RaidCandidate[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    getRaidCandidatesForLoot({ source, acquiredAt }).then(setCandidates);
  }, [isOpen, source, acquiredAt]);

  const handleSelect = (candidate: RaidCandidate | null) => {
    onChange(candidate ? candidate.id : null);
    setIsOpen(false);
  };

  const selectedCandidate = candidates.find((c) => c.id === value);
  const label = value
    ? selectedCandidate
      ? formatRaidLabel(selectedCandidate)
      : (initialLabel ?? `Рейд #${value}`)
    : "Без привязки";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border rounded px-2 py-1 text-left cursor-pointer w-full truncate"
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="p-1 w-[340px] max-h-72 overflow-y-auto"
        align="start"
      >
        <button
          type="button"
          className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer text-muted-foreground"
          onClick={() => handleSelect(null)}
        >
          Без привязки
        </button>
        {candidates.length === 0 && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            Рейды в этот день не найдены
          </div>
        )}
        {candidates.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => handleSelect(c)}
            className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent cursor-pointer flex items-center justify-between gap-2 ${
              value === c.id ? "bg-accent" : ""
            }`}
          >
            <span>{formatRaidLabel(c)}</span>
            {c.matchesBoss && (
              <span className="text-xs text-muted-foreground shrink-0">
                по боссу
              </span>
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
