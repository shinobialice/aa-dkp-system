"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { getRunesForSlot, type Rune } from "./itemsData/runes";
import { getItemGradeIconUrl } from "./itemsData/paths";
import type { WeaponHandedness } from "./itemsData/weaponHandedness";
import {
  getSealGradeColor,
  getSealGradeLabel,
} from "@/widgets/profile/seals/sealsData";
import {
  Input,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/ui";
import { EffectText } from "./highlightNumbers";

export function RuneIcon({ rune, size }: { rune: Rune; size: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src={rune.iconUrl}
        alt={rune.name}
        width={size}
        height={size}
        className="absolute inset-0"
      />
      <Image
        src={getItemGradeIconUrl(rune.grade)}
        alt=""
        width={size}
        height={size}
        className="absolute inset-0"
      />
    </div>
  );
}

export function RuneTooltip({
  rune,
  side = "left",
  children,
}: {
  rune: Rune;
  side?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
}) {
  const color = getSealGradeColor(rune.grade);
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        className="dark pointer-events-none w-64 border-border bg-background p-3 text-foreground"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <RuneIcon rune={rune} size={32} />
            <div className="min-w-0">
              <div className="text-xs" style={{ color: color ?? undefined }}>
                {getSealGradeLabel(rune.grade)} предмет
              </div>
              <div
                className="truncate text-sm font-semibold"
                style={{ color: color ?? undefined }}
              >
                {rune.name}
              </div>
            </div>
          </div>
          {rune.effect && (
            <>
              <div className="border-t border-border" />
              <div className="space-y-0.5 text-xs text-muted-foreground">
                <EffectText text={rune.effect} />
              </div>
            </>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function RunePicker({
  slot,
  handedness,
  itemId,
  value,
  onSelect,
}: {
  slot: string;
  handedness?: WeaponHandedness;
  itemId?: number;
  value: number;
  onSelect: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const available = getRunesForSlot(slot, handedness, itemId);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = available.find((r) => r.id === value);

  const filtered = query.trim()
    ? available.filter((r) =>
        r.name.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : available;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-input/30 px-3 py-2 text-sm"
      >
        {selected ? (
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <RuneIcon rune={selected} size={20} />
            <span className="min-w-0 flex-1 truncate text-left">
              {selected.name}
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">Начните вводить название...</span>
        )}
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="p-1.5">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Начните вводить название..."
              autoComplete="off"
            />
          </div>
          <div className="max-h-56 space-y-0.5 overflow-y-auto p-1">
            <button
              type="button"
              onClick={() => {
                onSelect(0);
                setOpen(false);
                setQuery("");
              }}
              className={`flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent ${
                value === 0 ? "bg-accent" : ""
              }`}
            >
              <div className="size-5 shrink-0 rounded-sm border border-border bg-muted" />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">
                Выберите
              </span>
            </button>
            {filtered.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Ничего не найдено
              </div>
            )}
            {filtered.map((rune) => (
              <RuneTooltip key={rune.id} rune={rune} side="right">
                <button
                  type="button"
                  onClick={() => {
                    onSelect(rune.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent ${
                    value === rune.id ? "bg-accent" : ""
                  }`}
                >
                  <RuneIcon rune={rune} size={28} />
                  <span className="min-w-0 flex-1 truncate">{rune.name}</span>
                </button>
              </RuneTooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
