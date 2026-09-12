"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { getEngravingsForSlot, type Engraving } from "./itemsData/engravings";
import { getEngravingCategory } from "./itemsData/engravingSlots";
import type { WeaponHandedness } from "./itemsData/weaponHandedness";
import { getItemGradeIconUrl } from "./itemsData/paths";
import {
  getSealGradeColor,
  getSealGradeLabel,
} from "@/widgets/profile/seals/sealsData";
import { Input, Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";
import { highlightNumbers } from "./highlightNumbers";

export function EngravingIcon({
  engraving,
  size,
}: {
  engraving: Engraving;
  size: number;
}) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src={engraving.iconUrl}
        alt={engraving.name}
        width={size}
        height={size}
        className="absolute inset-0"
      />
      <Image
        src={getItemGradeIconUrl(engraving.grade)}
        alt=""
        width={size}
        height={size}
        className="absolute inset-0"
      />
    </div>
  );
}

export function EngravingTooltip({
  engraving,
  side = "left",
  children,
}: {
  engraving: Engraving;
  side?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
}) {
  const color = getSealGradeColor(engraving.grade);
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        className="dark w-56 border-border bg-background p-3 text-foreground"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <EngravingIcon engraving={engraving} size={32} />
            <div className="min-w-0">
              <div className="text-xs" style={{ color: color ?? undefined }}>
                {getSealGradeLabel(engraving.grade)} предмет
              </div>
              <div
                className="truncate text-sm font-semibold"
                style={{ color: color ?? undefined }}
              >
                {engraving.name}
              </div>
            </div>
          </div>
          {engraving.effect && (
            <>
              <div className="border-t border-border" />
              <div className="text-xs text-muted-foreground">
                {highlightNumbers(engraving.effect)}
              </div>
            </>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// В списке сначала показываем зачарованные гравировки (самые доступные из
// сильных), потом шестигранные (топ грейд), остальное — как есть.
function pickerPriority(name: string): number {
  if (name.startsWith("Зачарованная")) return 0;
  if (name.startsWith("Шестигранная")) return 1;
  return 2;
}

// У бижутерии (кольца/серьги) всего 4 тира на один и тот же эффект —
// группируем по названию эффекта и внутри группы идём от старшего тира
// (Драгоценная) к младшему, а не вперемешку.
const JEWELRY_TIER_PREFIXES: [string, number][] = [
  ["Драгоценная ", 4],
  ["Зачарованная ", 3],
  ["Искусная ", 2],
];

function getJewelryTierAndFamily(name: string): { tier: number; family: string } {
  for (const [prefix, tier] of JEWELRY_TIER_PREFIXES) {
    if (name.startsWith(prefix)) {
      return { tier, family: name.slice(prefix.length).toLowerCase() };
    }
  }
  return { tier: 1, family: name.toLowerCase() };
}

export function EngravingPicker({
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

  const isJewelry = getEngravingCategory(slot) === "jewelry";
  const available = getEngravingsForSlot(slot, handedness, itemId)
    .slice()
    .sort((a, b) => {
      if (isJewelry) {
        const fa = getJewelryTierAndFamily(a.name);
        const fb = getJewelryTierAndFamily(b.name);
        return (
          fa.family.localeCompare(fb.family, "ru") || fb.tier - fa.tier
        );
      }
      return pickerPriority(a.name) - pickerPriority(b.name);
    });

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

  const selected = available.find((e) => e.id === value);

  const filtered = query.trim()
    ? available.filter((e) =>
        e.name.toLowerCase().includes(query.trim().toLowerCase()),
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
            <EngravingIcon engraving={selected} size={20} />
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
            {filtered.map((engraving) => (
              <EngravingTooltip key={engraving.id} engraving={engraving} side="right">
                <button
                  type="button"
                  onClick={() => {
                    onSelect(engraving.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent ${
                    value === engraving.id ? "bg-accent" : ""
                  }`}
                >
                  <EngravingIcon engraving={engraving} size={28} />
                  <span className="min-w-0 flex-1 truncate">{engraving.name}</span>
                </button>
              </EngravingTooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
