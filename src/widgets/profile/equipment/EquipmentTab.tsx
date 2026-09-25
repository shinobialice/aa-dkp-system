"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import saveUserEquipment, { EquipmentInput } from "@/actions/saveUserEquipment";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import { EQUIPMENT_SLOTS, type EquipmentSlot } from "./equipmentData";
import { ITEMS_BY_SLOT, findGearItem } from "./itemsData";
import { getEngravingSlotCount } from "./itemsData/engravingSlots";
import { getNamedSetForItem } from "./namedSetBonus";
import { getEphenRuneSetForRune } from "./ephenRuneSetBonus";
import {
  DEFAULT_ENCHANT,
  MAX_ENCHANT,
  isValidEnchantLevel,
  DEFAULT_EXTRA_PROTECTION,
  getMaxExtraProtectionLevel,
  isValidExtraProtectionLevel,
} from "./itemsData/statsFormula";
import { GearItemIcon } from "./GearItemIcon";
import { GearItemPicker } from "./GearItemPicker";
import {
  EngravingPicker,
  EngravingIcon,
  EngravingTooltip,
} from "./EngravingPicker";
import { findEngraving } from "./itemsData/engravings";
import { RunePicker, RuneIcon, RuneTooltip } from "./RunePicker";
import { findRune } from "./itemsData/runes";
import { SynthesisEffectPicker } from "./SynthesisEffectPicker";
import {
  getCostumeRole,
  getCostumeSynthesisSlotCount,
  getCostumeSynthesisEffectsForRole,
  findCostumeSynthesisEffect,
} from "./itemsData/costumeSynthesis";
import {
  getUnderwearRole,
  getUnderwearSynthesisSlotCount,
  getUnderwearSynthesisEffectsForRole,
  findUnderwearSynthesisEffect,
} from "./itemsData/underwearSynthesis";
import {
  getCursedArmorSynthesisSlotPools,
  findCursedArmorSynthesisEffect,
} from "./itemsData/cursedArmorSynthesis";
import {
  RING_SYNTHESIS_EFFECTS,
  RING_SYNTHESIS_SLOT_COUNT,
  isRingSynthesisItem,
  findRingSynthesisEffect,
} from "./itemsData/ringSynthesis";
import { getEphenSynthesisCategory } from "./itemsData/ephenSynthesis";
import { getEphenSynthesisOptionRange } from "./itemsData/ephenSynthesisData";
import {
  getEphenSynthesisRolls,
  hasEphenSynthesisSelection,
} from "./ephenSynthesisBonus";
import { WEAPON_HANDEDNESS } from "./itemsData/weaponHandedness";
import { EffectText, highlightNumbers } from "./highlightNumbers";
import { ItemStats } from "./ItemStats";
import { CharacterStatsPanel } from "./CharacterStatsPanel";
import { DetailedStatsPanel } from "./DetailedStatsPanel";
import { CharacterPortraitUpload } from "./CharacterPortraitUpload";
import {
  SEAL_GRADES,
  getSealGradeLabel,
  getSealGradeColor,
} from "@/widgets/profile/seals/sealsData";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import CharacterTabsSwitcher from "@/widgets/profile/CharacterTabsSwitcher";
import { Input } from "@/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui";

const DEFAULT_GRADE = 1;

const TOP_SLOT = "costume";

const LEFT_SLOTS = [
  "head",
  "chest",
  "belt",
  "bracers",
  "hands",
  "cloak",
  "legs",
  "feet",
  "underwear",
];

const RIGHT_SLOTS = [
  "necklace",
  "earring1",
  "earring2",
  "ring1",
  "ring2",
  "weapon_main",
  "weapon_off",
  "weapon_ranged",
  "instrument",
];

const ARMOR_SLOTS = new Set([
  "head",
  "chest",
  "belt",
  "bracers",
  "hands",
  "legs",
  "feet",
]);

// Заточка кубами доступна только для брони и оружия (основного, доп. и
// дальнобойного) — не для инструмента, украшений, плаща, белья, костюма.
const CUBE_ELIGIBLE_SLOTS = new Set([
  ...ARMOR_SLOTS,
  "weapon_main",
  "weapon_off",
  "weapon_ranged",
]);

function getFixedGrade(name: string, grade: number): number | null {
  if (name.includes("проклятого") || name.includes("возрожденного")) return 12;
  if (name.includes("ранга")) return grade;
  return null;
}

function slotsFor(keys: string[]): EquipmentSlot[] {
  return keys
    .map((key) => EQUIPMENT_SLOTS.find((s) => s.key === key))
    .filter((s): s is EquipmentSlot => !!s);
}

const TOP = EQUIPMENT_SLOTS.find((s) => s.key === TOP_SLOT)!;
const LEFT = slotsFor(LEFT_SLOTS);
const RIGHT = slotsFor(RIGHT_SLOTS);

function EngravingDisplay({
  count,
  engravings,
}: {
  count: number;
  engravings: number[];
}) {
  if (count === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: count }).map((_, i) => {
        const engraving = findEngraving(engravings[i] ?? 0);
        if (!engraving) {
          return (
            <div
              key={i}
              className="size-5 shrink-0 rounded-sm border border-border bg-muted"
            />
          );
        }
        return (
          <div key={i} className="flex items-center gap-1.5">
            <EngravingIcon engraving={engraving} size={20} />
            {engraving.effect && (
              <div className="text-xs text-green-500">
                <EffectText text={engraving.effect} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SynthesisEffectsDisplay({
  slotKey,
  effectIds,
}: {
  slotKey: string;
  effectIds: number[];
}) {
  if (effectIds.length === 0) return null;

  const findEffect =
    slotKey === "costume"
      ? findCostumeSynthesisEffect
      : findUnderwearSynthesisEffect;

  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground">Эффекты синтеза</div>
      {effectIds.map((id) => {
        const effect = findEffect(id);
        if (!effect) return null;
        const value = effect.isPercent
          ? `${effect.value}%`
          : `${effect.value} ед.`;
        return (
          <div key={id} className="text-xs text-green-500">
            {highlightNumbers(`${effect.label}: ${value}`)}
          </div>
        );
      })}
    </div>
  );
}

function CursedArmorSynthesisDisplay({ effectIds }: { effectIds: number[] }) {
  if (effectIds.length === 0) return null;

  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground">Эффекты синтеза</div>
      {effectIds.map((id) => {
        const effect = findCursedArmorSynthesisEffect(id);
        if (!effect) return null;
        const value = effect.isPercent
          ? `${effect.value}%`
          : `${effect.value} ед.`;
        return (
          <div key={id} className="text-xs text-green-500">
            {highlightNumbers(`${effect.label}: ${value}`)}
          </div>
        );
      })}
    </div>
  );
}

function RingSynthesisDisplay({ effectIds }: { effectIds: number[] }) {
  if (effectIds.length === 0) return null;

  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground">Эффекты синтеза</div>
      {effectIds.map((id) => {
        const effect = findRingSynthesisEffect(id);
        if (!effect) return null;
        const value = effect.isPercent
          ? `${effect.value}%`
          : `${effect.value} ед.`;
        return (
          <div key={id} className="text-xs text-green-500">
            {highlightNumbers(`${effect.label}: ${value}`)}
          </div>
        );
      })}
    </div>
  );
}

function EphenSynthesisDisplay({ item }: { item: UserEquipment }) {
  if (!hasEphenSynthesisSelection(item)) return null;
  const rolls = getEphenSynthesisRolls(item);
  if (rolls.length === 0) return null;

  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground">
        Эффект синтеза ({item.ephen_synthesis_percent}%)
      </div>
      {rolls.map((roll) => (
        <div key={roll.key} className="text-xs text-green-500">
          {highlightNumbers(
            `${roll.label}: +${roll.value}${roll.isPercent ? "%" : " ед."}`,
          )}
        </div>
      ))}
    </div>
  );
}

function EngravingSlots({
  count,
  engravings,
  selectedEngravingId,
  onToggle,
  onClearAll,
}: {
  count: number;
  engravings: number[];
  selectedEngravingId: number;
  onToggle: (index: number) => void;
  onClearAll: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => {
        const engraving = findEngraving(engravings[i] ?? 0);
        const square = (
          <button
            type="button"
            onClick={() => onToggle(i)}
            disabled={!engraving && !selectedEngravingId}
            className={`flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors ${
              engraving
                ? "cursor-pointer border-border bg-input/30 hover:border-destructive/60"
                : selectedEngravingId
                  ? "cursor-pointer border-dashed border-primary/60 bg-muted hover:bg-accent"
                  : "cursor-default border-border bg-muted"
            }`}
          >
            {engraving && <EngravingIcon engraving={engraving} size={28} />}
          </button>
        );
        return engraving ? (
          <EngravingTooltip key={i} engraving={engraving} side="top">
            {square}
          </EngravingTooltip>
        ) : (
          <span key={i}>{square}</span>
        );
      })}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="cursor-pointer text-destructive hover:text-destructive"
        onClick={onClearAll}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function SetTierRow({
  count,
  text,
  active,
}: {
  count: number;
  text: string;
  active: boolean;
}) {
  return (
    <div className={active ? "text-green-500" : "text-muted-foreground/70"}>
      <div className="text-[11px] font-semibold">[{count} шт.]</div>
      {text.split("\n").map((line, i) => (
        <div key={i} className="text-xs">
          {active ? highlightNumbers(line) : line}
        </div>
      ))}
    </div>
  );
}

function SetProgress({
  itemId,
  runeId,
  equipment,
}: {
  itemId: number;
  runeId?: number;
  equipment: UserEquipment[];
}) {
  const namedSet = getNamedSetForItem(itemId, equipment);
  const ephenRuneSet = runeId
    ? getEphenRuneSetForRune(runeId, equipment)
    : null;

  if (!namedSet && !ephenRuneSet) return null;

  return (
    <>
      {namedSet && (
        <>
          <div className="border-t border-border" />
          <div className="space-y-1">
            <div className="text-xs font-semibold">
              {namedSet.name} ({namedSet.ownedCount}/{namedSet.totalCount})
            </div>
            <div className="space-y-1">
              {namedSet.pieceRows.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((piece) => (
                    <div
                      key={piece.itemId}
                      title={piece.name}
                      className={`relative size-6 shrink-0 overflow-hidden rounded-sm border ${
                        piece.owned
                          ? "border-border"
                          : "border-border/50 opacity-30 grayscale"
                      }`}
                    >
                      {piece.iconUrl && (
                        <Image
                          src={piece.iconUrl}
                          alt=""
                          fill
                          sizes="24px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {namedSet.tiers.map((tier) => (
                <SetTierRow
                  key={tier.count}
                  count={tier.count}
                  text={tier.text}
                  active={tier.active}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {ephenRuneSet && (
        <>
          <div className="border-t border-border" />
          <div className="space-y-1">
            <div className="text-xs font-semibold">
              {ephenRuneSet.name} ({ephenRuneSet.count}/8)
            </div>
            <div className="space-y-1.5">
              {ephenRuneSet.tiers.map((tier) => (
                <SetTierRow
                  key={tier.count}
                  count={tier.count}
                  text={tier.text}
                  active={tier.active}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function EquipmentSlotButton({
  slot,
  item,
  equipment,
  canEdit,
  onSave,
  tooltipSide = "left",
}: {
  slot: EquipmentSlot;
  item: UserEquipment | undefined;
  equipment: UserEquipment[];
  canEdit: boolean;
  onSave: (
    itemName: string,
    grade: number,
    enchant: number,
    extraProtection: number,
    engravings: number[],
    runeId: number,
    synthesisEffects: number[],
    cursedSynthesisEffects: number[],
    ringSynthesisEffects: number[],
    ephenSynthesisPercent: number,
    ephenSynthesisPrimary: string,
    ephenSynthesisSecondary: string,
    ephenSynthesisTertiary: string[],
  ) => Promise<void>;
  tooltipSide?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState(item?.item_name ?? "");
  const [grade, setGrade] = useState(item?.grade ?? DEFAULT_GRADE);
  const [enchant, setEnchant] = useState(item?.enchant ?? DEFAULT_ENCHANT);
  const [extraProtection, setExtraProtection] = useState(
    item?.extra_protection ?? DEFAULT_EXTRA_PROTECTION,
  );
  const [engravings, setEngravings] = useState<number[]>(
    item?.engravings ?? [],
  );
  const [selectedEngravingId, setSelectedEngravingId] = useState(0);
  const [runeId, setRuneId] = useState(item?.rune_id ?? 0);
  const initialSynthesisEffects =
    slot.key === "costume"
      ? (item?.costume_synthesis_effects ?? [])
      : slot.key === "underwear"
        ? (item?.underwear_synthesis_effects ?? [])
        : [];
  const [synthesisEffects, setSynthesisEffects] = useState<number[]>(
    initialSynthesisEffects,
  );
  const [cursedSynthesisEffects, setCursedSynthesisEffects] = useState<
    number[]
  >(item?.cursed_synthesis_effects ?? []);
  const [ringSynthesisEffects, setRingSynthesisEffects] = useState<number[]>(
    item?.ring_synthesis_effects ?? [],
  );
  const [ephenSynthesisPercent, setEphenSynthesisPercent] = useState(
    item?.ephen_synthesis_percent ?? 0,
  );
  const [ephenSynthesisPrimary, setEphenSynthesisPrimary] = useState(
    item?.ephen_synthesis_primary ?? "",
  );
  const [ephenSynthesisSecondary, setEphenSynthesisSecondary] = useState(
    item?.ephen_synthesis_secondary ?? "",
  );
  const [ephenSynthesisTertiary, setEphenSynthesisTertiary] = useState<
    string[]
  >(item?.ephen_synthesis_tertiary ?? []);
  const [saving, setSaving] = useState(false);

  const filled = !!item?.item_name;
  const knownItems = ITEMS_BY_SLOT[slot.key];
  const selectedGearItem = findGearItem(slot.key, item?.item_name);
  const draftGearItem = findGearItem(slot.key, itemName);
  const fixedGrade = draftGearItem
    ? getFixedGrade(draftGearItem.name, draftGearItem.grade)
    : null;
  const isFixedGradeItem = fixedGrade !== null;
  const maxEngravingSlots = getEngravingSlotCount(slot.key, grade);
  const draftHandedness = draftGearItem
    ? WEAPON_HANDEDNESS[draftGearItem.id]
    : undefined;
  const draftSynthesisRole =
    slot.key === "costume"
      ? getCostumeRole(itemName)
      : slot.key === "underwear"
        ? getUnderwearRole(itemName)
        : undefined;
  const maxSynthesisSlots =
    slot.key === "costume"
      ? getCostumeSynthesisSlotCount(grade)
      : slot.key === "underwear"
        ? getUnderwearSynthesisSlotCount(grade)
        : 0;
  const synthesisEffectOptions = !draftSynthesisRole
    ? []
    : slot.key === "costume"
      ? getCostumeSynthesisEffectsForRole(draftSynthesisRole)
      : getUnderwearSynthesisEffectsForRole(draftSynthesisRole);
  const cursedSynthesisPools = draftGearItem
    ? getCursedArmorSynthesisSlotPools(draftGearItem.id)
    : [];
  const isRingSynthDraft =
    !!draftGearItem && isRingSynthesisItem(draftGearItem.id);
  const ephenSynthesisCategory = draftGearItem
    ? getEphenSynthesisCategory(draftGearItem.id)
    : undefined;
  const ephenSynthesisEligible =
    !!ephenSynthesisCategory && grade >= ephenSynthesisCategory.minGrade;

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setItemName(item?.item_name ?? "");
      const openingItem = findGearItem(slot.key, item?.item_name);
      const openingFixedGrade = openingItem
        ? getFixedGrade(openingItem.name, openingItem.grade)
        : null;
      setGrade(openingFixedGrade ?? item?.grade ?? DEFAULT_GRADE);
      setEnchant(item?.enchant ?? DEFAULT_ENCHANT);
      setExtraProtection(item?.extra_protection ?? DEFAULT_EXTRA_PROTECTION);
      setEngravings(item?.engravings ?? []);
      setSelectedEngravingId(0);
      setRuneId(item?.rune_id ?? 0);
      setSynthesisEffects(initialSynthesisEffects);
      setCursedSynthesisEffects(item?.cursed_synthesis_effects ?? []);
      setRingSynthesisEffects(item?.ring_synthesis_effects ?? []);
      setEphenSynthesisPercent(item?.ephen_synthesis_percent ?? 0);
      setEphenSynthesisPrimary(item?.ephen_synthesis_primary ?? "");
      setEphenSynthesisSecondary(item?.ephen_synthesis_secondary ?? "");
      setEphenSynthesisTertiary(item?.ephen_synthesis_tertiary ?? []);
    }
    setOpen(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const finalCursedSynthesisEffects: number[] = [];
      for (let i = 0; i < cursedSynthesisPools.length; i++) {
        const value = cursedSynthesisEffects[i];
        if (value === undefined || value === -1) break;
        finalCursedSynthesisEffects.push(value);
      }
      await onSave(
        itemName,
        grade,
        enchant,
        extraProtection,
        engravings.slice(0, maxEngravingSlots),
        runeId,
        synthesisEffects.slice(0, maxSynthesisSlots),
        finalCursedSynthesisEffects,
        isRingSynthDraft
          ? ringSynthesisEffects.slice(0, RING_SYNTHESIS_SLOT_COUNT)
          : [],
        ephenSynthesisEligible ? ephenSynthesisPercent : 0,
        ephenSynthesisEligible ? ephenSynthesisPrimary : "",
        ephenSynthesisEligible ? ephenSynthesisSecondary : "",
        ephenSynthesisEligible ? ephenSynthesisTertiary : [],
      );
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    setSaving(true);
    try {
      await onSave(
        "",
        DEFAULT_GRADE,
        DEFAULT_ENCHANT,
        DEFAULT_EXTRA_PROTECTION,
        [],
        0,
        [],
        [],
        [],
        0,
        "",
        "",
        [],
      );
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const slotGlow = selectedGearItem
    ? (getSealGradeColor(item?.grade ?? DEFAULT_GRADE) ?? "#d6b673")
    : "var(--border)";

  const button = (
    <button
      type="button"
      className="group relative flex size-11 shrink-0 items-center justify-center rounded-md transition-transform duration-200 ease-out cursor-pointer hover:-translate-y-0.5"
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 8px 0 color-mix(in srgb, ${slotGlow} 65%, transparent), 0 0 18px 2px color-mix(in srgb, ${slotGlow} 40%, transparent), 0 0 28px 6px color-mix(in srgb, ${slotGlow} 20%, transparent)`,
        }}
      />
      {selectedGearItem ? (
        <GearItemIcon
          item={selectedGearItem}
          grade={item?.grade ?? DEFAULT_GRADE}
          className="transition-transform duration-200 ease-out group-hover:scale-110"
        />
      ) : (
        <Image
          src={slot.iconUrl}
          alt={slot.label}
          fill
          sizes="44px"
          className="object-contain transition-transform duration-200 ease-out group-hover:scale-110"
        />
      )}
    </button>
  );

  const gradeColor = getSealGradeColor(grade);
  const tooltipGradeColor = getSealGradeColor(item?.grade ?? DEFAULT_GRADE);
  const equippedRune = item?.rune_id ? findRune(item.rune_id) : undefined;
  const equippedSynthesisEffects =
    slot.key === "costume"
      ? (item?.costume_synthesis_effects ?? [])
      : slot.key === "underwear"
        ? (item?.underwear_synthesis_effects ?? [])
        : [];
  const equippedCursedSynthesisEffects = item?.cursed_synthesis_effects ?? [];
  const equippedRingSynthesisEffects = item?.ring_synthesis_effects ?? [];

  return (
    <div className="relative">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {selectedGearItem ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>{button}</DialogTrigger>
            </TooltipTrigger>
            <TooltipContent
              side={tooltipSide}
              className="dark pointer-events-none w-64 border-border bg-background p-3 text-foreground"
            >
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <GearItemIcon
                    item={selectedGearItem}
                    grade={item?.grade ?? DEFAULT_GRADE}
                    size={40}
                  />
                  <div className="min-w-0">
                    <div
                      className="text-xs"
                      style={{ color: tooltipGradeColor ?? undefined }}
                    >
                      {getSealGradeLabel(item?.grade ?? DEFAULT_GRADE)} предмет
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: tooltipGradeColor ?? undefined }}
                    >
                      {(item?.enchant ?? 0) > 0 && `+${item?.enchant} `}
                      {selectedGearItem.name}
                    </div>
                  </div>
                </div>

                {CUBE_ELIGIBLE_SLOTS.has(slot.key) && (
                  <div className="text-xs text-muted-foreground/70">
                    Защита от доп. урона оружия Lv.
                    {item?.extra_protection ?? DEFAULT_EXTRA_PROTECTION}
                  </div>
                )}

                <div className="border-t border-border" />

                <ItemStats
                  itemId={selectedGearItem.id}
                  grade={item?.grade ?? DEFAULT_GRADE}
                  enchant={item?.enchant ?? DEFAULT_ENCHANT}
                  bare
                />

                {equippedRune && (
                  <>
                    <div className="border-t border-border" />
                    <div className="flex items-start gap-1.5">
                      <RuneIcon rune={equippedRune} size={20} />
                      {equippedRune.effect && (
                        <div className="min-w-0 flex-1 space-y-0.5 text-xs text-green-500">
                          <EffectText text={equippedRune.effect} />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {getEngravingSlotCount(slot.key, item?.grade ?? DEFAULT_GRADE) >
                  0 && (
                  <>
                    <div className="border-t border-border" />
                    <EngravingDisplay
                      count={getEngravingSlotCount(
                        slot.key,
                        item?.grade ?? DEFAULT_GRADE,
                      )}
                      engravings={item?.engravings ?? []}
                    />
                  </>
                )}

                {(equippedSynthesisEffects.length ?? 0) > 0 && (
                  <>
                    <div className="border-t border-border" />
                    <SynthesisEffectsDisplay
                      slotKey={slot.key}
                      effectIds={equippedSynthesisEffects}
                    />
                  </>
                )}

                {equippedCursedSynthesisEffects.length > 0 && (
                  <>
                    <div className="border-t border-border" />
                    <CursedArmorSynthesisDisplay
                      effectIds={equippedCursedSynthesisEffects}
                    />
                  </>
                )}

                {equippedRingSynthesisEffects.length > 0 && (
                  <>
                    <div className="border-t border-border" />
                    <RingSynthesisDisplay
                      effectIds={equippedRingSynthesisEffects}
                    />
                  </>
                )}

                {item && hasEphenSynthesisSelection(item) && (
                  <>
                    <div className="border-t border-border" />
                    <EphenSynthesisDisplay item={item} />
                  </>
                )}

                <SetProgress
                  itemId={selectedGearItem.id}
                  runeId={item?.rune_id}
                  equipment={equipment}
                />
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <DialogTrigger asChild>{button}</DialogTrigger>
        )}
        <DialogContent
          aria-describedby={undefined}
          className="dark w-full max-w-2xl border-border bg-background text-foreground"
        >
          <DialogHeader>
            <DialogTitle>{slot.label}</DialogTitle>
          </DialogHeader>

          {canEdit ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="text-xs text-muted-foreground">Предмет:</div>
                {knownItems ? (
                  <GearItemPicker
                    items={knownItems}
                    value={itemName}
                    onSelect={(gearItem) => {
                      setItemName(gearItem.name);
                      setGrade(gearItem.grade);
                    }}
                  />
                ) : (
                  <Input
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Название предмета"
                  />
                )}
              </div>

              {itemName.trim() !== "" && (
                <div className="space-y-1.5">
                  <div className="text-xs text-muted-foreground">
                    Качество предмета:
                  </div>
                  <Select
                    value={String(grade)}
                    onValueChange={(v) => setGrade(Number(v))}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="Грейд" />
                    </SelectTrigger>
                    <SelectContent>
                      {(isFixedGradeItem
                        ? SEAL_GRADES.filter((g) => g.grade === fixedGrade)
                        : SEAL_GRADES
                      ).map((g) => {
                        const optionColor = getSealGradeColor(g.grade);
                        return (
                          <SelectItem key={g.grade} value={String(g.grade)}>
                            <span
                              style={
                                optionColor ? { color: optionColor } : undefined
                              }
                            >
                              {g.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {itemName.trim() !== "" && CUBE_ELIGIBLE_SLOTS.has(slot.key) && (
                <div className="space-y-1.5">
                  <div className="text-xs text-muted-foreground">Куб:</div>
                  <Input
                    type="number"
                    min={0}
                    max={MAX_ENCHANT}
                    step={1}
                    value={enchant}
                    onChange={(e) => {
                      const next = Math.round(Number(e.target.value));
                      if (isValidEnchantLevel(next)) setEnchant(next);
                      else if (e.target.value === "")
                        setEnchant(DEFAULT_ENCHANT);
                    }}
                    className="w-24"
                  />
                </div>
              )}

              {itemName.trim() !== "" && CUBE_ELIGIBLE_SLOTS.has(slot.key) && (
                <div className="space-y-1.5">
                  <div className="text-xs text-muted-foreground">Доп.:</div>
                  <Input
                    type="number"
                    min={0}
                    max={getMaxExtraProtectionLevel(slot.key)}
                    step={1}
                    value={extraProtection}
                    onChange={(e) => {
                      const next = Math.round(Number(e.target.value));
                      if (isValidExtraProtectionLevel(next, slot.key))
                        setExtraProtection(next);
                      else if (e.target.value === "")
                        setExtraProtection(DEFAULT_EXTRA_PROTECTION);
                    }}
                    className="w-24"
                  />
                </div>
              )}

              {itemName.trim() !== "" && maxEngravingSlots > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs text-muted-foreground">
                    Гравировки:
                  </div>
                  <EngravingPicker
                    slot={slot.key}
                    handedness={draftHandedness}
                    itemId={draftGearItem?.id}
                    value={selectedEngravingId}
                    onSelect={setSelectedEngravingId}
                  />
                  <EngravingSlots
                    count={maxEngravingSlots}
                    engravings={engravings}
                    selectedEngravingId={selectedEngravingId}
                    onToggle={(i) => {
                      setEngravings((prev) => {
                        const next = [...prev];
                        while (next.length <= i) next.push(0);
                        next[i] = next[i] ? 0 : selectedEngravingId;
                        return next;
                      });
                    }}
                    onClearAll={() => setEngravings([])}
                  />
                </div>
              )}

              {itemName.trim() !== "" && (
                <div className="space-y-1.5">
                  <div className="text-xs text-muted-foreground">
                    Лунный камень / руна:
                  </div>
                  <RunePicker
                    slot={slot.key}
                    handedness={draftHandedness}
                    itemId={draftGearItem?.id}
                    value={runeId}
                    onSelect={setRuneId}
                    equipment={equipment}
                  />
                </div>
              )}

              {draftSynthesisRole && (
                <div className="space-y-1.5">
                  <div className="text-xs text-muted-foreground">
                    Эффекты синтеза:
                  </div>
                  {maxSynthesisSlots > 0 ? (
                    <SynthesisEffectPicker
                      effects={synthesisEffectOptions}
                      slotCount={maxSynthesisSlots}
                      value={synthesisEffects}
                      onChange={setSynthesisEffects}
                    />
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Доступны начиная с качества «Необычный» — выберите
                      качество выше.
                    </div>
                  )}
                </div>
              )}

              {cursedSynthesisPools.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs text-muted-foreground">
                    Эффекты синтеза:
                  </div>
                  <div className="space-y-1.5">
                    {cursedSynthesisPools.map((pool, i) => (
                      <Select
                        key={i}
                        value={String(cursedSynthesisEffects[i] ?? -1)}
                        onValueChange={(v) => {
                          const next = [...cursedSynthesisEffects];
                          next[i] = Number(v);
                          setCursedSynthesisEffects(next);
                        }}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-1">Выберите</SelectItem>
                          {pool.map((effect) => (
                            <SelectItem
                              key={effect.id}
                              value={String(effect.id)}
                            >
                              {effect.label}:{" "}
                              {effect.isPercent
                                ? `${effect.value}%`
                                : `${effect.value} ед.`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ))}
                  </div>
                </div>
              )}

              {isRingSynthDraft && (
                <div className="space-y-1.5">
                  <div className="text-xs text-muted-foreground">
                    Эффекты синтеза:
                  </div>
                  <SynthesisEffectPicker
                    effects={RING_SYNTHESIS_EFFECTS}
                    slotCount={RING_SYNTHESIS_SLOT_COUNT}
                    value={ringSynthesisEffects}
                    onChange={setRingSynthesisEffects}
                  />
                </div>
              )}

              {ephenSynthesisCategory && (
                <div className="space-y-1.5">
                  <div className="text-xs text-muted-foreground">
                    Эффект синтеза:
                  </div>
                  {!ephenSynthesisEligible ? (
                    <div className="text-xs text-muted-foreground">
                      Доступен начиная с качества «
                      {getSealGradeLabel(ephenSynthesisCategory.minGrade)}» —
                      выберите качество выше.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Опыт синтеза</span>
                          <span>{ephenSynthesisPercent}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={ephenSynthesisPercent}
                          onChange={(e) =>
                            setEphenSynthesisPercent(Number(e.target.value))
                          }
                          className="w-full cursor-pointer"
                        />
                      </div>
                      {ephenSynthesisCategory.groups.length === 2 ? (
                        <>
                          <div className="text-xs text-muted-foreground">
                            Первый пул (выбрано {ephenSynthesisTertiary.length}/
                            {ephenSynthesisCategory.groups[0].pickCount})
                          </div>
                          <div className="max-h-48 space-y-0.5 overflow-y-auto rounded-md border p-1">
                            {ephenSynthesisCategory.groups[0].options.map(
                              (option) => {
                                const checked = ephenSynthesisTertiary.includes(
                                  option.key,
                                );
                                const pickCount =
                                  ephenSynthesisCategory.groups[0].pickCount;
                                const disabled =
                                  !checked &&
                                  ephenSynthesisTertiary.length >= pickCount;
                                const range = getEphenSynthesisOptionRange(
                                  option,
                                  grade,
                                  ephenSynthesisCategory.minGrade,
                                );
                                return (
                                  <label
                                    key={option.key}
                                    className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent ${
                                      disabled
                                        ? "cursor-not-allowed opacity-40 hover:bg-transparent"
                                        : ""
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      disabled={disabled}
                                      onChange={() => {
                                        if (checked) {
                                          setEphenSynthesisTertiary(
                                            ephenSynthesisTertiary.filter(
                                              (k) => k !== option.key,
                                            ),
                                          );
                                        } else {
                                          setEphenSynthesisTertiary([
                                            ...ephenSynthesisTertiary,
                                            option.key,
                                          ]);
                                        }
                                      }}
                                      className="cursor-pointer"
                                    />
                                    <span className="min-w-0 flex-1 truncate">
                                      {option.label}
                                      {range
                                        ? `: +${range[0]}..+${range[1]}${option.isPercent ? "%" : ""}`
                                        : ""}
                                    </span>
                                  </label>
                                );
                              },
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Второй пул (выбрано{" "}
                            {ephenSynthesisSecondary ? 1 : 0}/1)
                          </div>
                          <div className="max-h-48 space-y-0.5 overflow-y-auto rounded-md border p-1">
                            {ephenSynthesisCategory.groups[1].options.map(
                              (option) => {
                                const checked =
                                  ephenSynthesisSecondary === option.key;
                                const range = getEphenSynthesisOptionRange(
                                  option,
                                  grade,
                                  ephenSynthesisCategory.minGrade,
                                );
                                return (
                                  <label
                                    key={option.key}
                                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() =>
                                        setEphenSynthesisSecondary(
                                          checked ? "" : option.key,
                                        )
                                      }
                                      className="cursor-pointer"
                                    />
                                    <span className="min-w-0 flex-1 truncate">
                                      {option.label}
                                      {range
                                        ? `: +${range[0]}..+${range[1]}${option.isPercent ? "%" : ""}`
                                        : ""}
                                    </span>
                                  </label>
                                );
                              },
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {ephenSynthesisCategory.groups
                            .slice(0, 2)
                            .map((group, gi) => {
                              const value =
                                gi === 0
                                  ? ephenSynthesisPrimary
                                  : ephenSynthesisSecondary;
                              const setValue =
                                gi === 0
                                  ? setEphenSynthesisPrimary
                                  : setEphenSynthesisSecondary;
                              const otherValue =
                                gi === 0
                                  ? ephenSynthesisSecondary
                                  : ephenSynthesisPrimary;
                              return (
                                <Select
                                  key={gi}
                                  value={value || "none"}
                                  onValueChange={(v) =>
                                    setValue(v === "none" ? "" : v)
                                  }
                                >
                                  <SelectTrigger className="w-full cursor-pointer">
                                    <SelectValue
                                      placeholder={
                                        gi === 0
                                          ? "Первая характеристика"
                                          : "Вторая характеристика"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Выберите
                                    </SelectItem>
                                    {group.options
                                      .filter(
                                        (option) => option.key !== otherValue,
                                      )
                                      .map((option) => {
                                        const range =
                                          getEphenSynthesisOptionRange(
                                            option,
                                            grade,
                                            ephenSynthesisCategory.minGrade,
                                          );
                                        return (
                                          <SelectItem
                                            key={option.key}
                                            value={option.key}
                                          >
                                            {option.label}
                                            {range
                                              ? `: +${range[0]}..+${range[1]}${option.isPercent ? "%" : ""}`
                                              : ""}
                                          </SelectItem>
                                        );
                                      })}
                                  </SelectContent>
                                </Select>
                              );
                            })}
                          {ephenSynthesisCategory.groups[2] && (
                            <div className="max-h-48 space-y-0.5 overflow-y-auto rounded-md border p-1">
                              {ephenSynthesisCategory.groups[2].options.map(
                                (option) => {
                                  const checked =
                                    ephenSynthesisTertiary.includes(option.key);
                                  const pickCount =
                                    ephenSynthesisCategory.groups[2].pickCount;
                                  const disabled =
                                    !checked &&
                                    ephenSynthesisTertiary.length >= pickCount;
                                  const range = getEphenSynthesisOptionRange(
                                    option,
                                    grade,
                                    ephenSynthesisCategory.minGrade,
                                  );
                                  return (
                                    <label
                                      key={option.key}
                                      className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent ${
                                        disabled
                                          ? "cursor-not-allowed opacity-40 hover:bg-transparent"
                                          : ""
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={disabled}
                                        onChange={() => {
                                          if (checked) {
                                            setEphenSynthesisTertiary(
                                              ephenSynthesisTertiary.filter(
                                                (k) => k !== option.key,
                                              ),
                                            );
                                          } else {
                                            setEphenSynthesisTertiary([
                                              ...ephenSynthesisTertiary,
                                              option.key,
                                            ]);
                                          }
                                        }}
                                        className="cursor-pointer"
                                      />
                                      <span className="min-w-0 flex-1 truncate">
                                        {option.label}
                                        {range
                                          ? `: +${range[0]}..+${range[1]}${option.isPercent ? "%" : ""}`
                                          : ""}
                                      </span>
                                    </label>
                                  );
                                },
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                {filled && (
                  <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={handleClear}
                    disabled={saving}
                  >
                    Очистить
                  </Button>
                )}
                <Button
                  className="cursor-pointer"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </div>
          ) : filled ? (
            <div className="space-y-1.5">
              {selectedGearItem && (
                <div className="flex items-center gap-2">
                  <GearItemIcon
                    item={selectedGearItem}
                    grade={item!.grade}
                    size={32}
                  />
                  <span
                    className="min-w-0 flex-1 truncate text-sm"
                    style={{ color: gradeColor ?? undefined }}
                  >
                    {selectedGearItem.name}
                  </span>
                </div>
              )}
              {!selectedGearItem && (
                <div className="text-sm">{item!.item_name}</div>
              )}
              <div className="flex gap-1.5">
                <Badge variant="outline">
                  {getSealGradeLabel(item!.grade)}
                </Badge>
                {item!.enchant > 0 && (
                  <Badge variant="outline">+{item!.enchant}</Badge>
                )}
              </div>
              {selectedGearItem && CUBE_ELIGIBLE_SLOTS.has(slot.key) && (
                <div className="text-xs text-muted-foreground/70">
                  Защита от доп. урона оружия Lv.{item!.extra_protection}
                </div>
              )}
              {selectedGearItem && (
                <ItemStats
                  itemId={selectedGearItem.id}
                  grade={item!.grade}
                  enchant={item!.enchant}
                />
              )}
              {equippedRune && (
                <div className="flex items-start gap-1.5">
                  <RuneIcon rune={equippedRune} size={20} />
                  {equippedRune.effect && (
                    <div className="min-w-0 flex-1 space-y-0.5 text-xs text-green-500">
                      <EffectText text={equippedRune.effect} />
                    </div>
                  )}
                </div>
              )}
              {getEngravingSlotCount(slot.key, item!.grade) > 0 && (
                <EngravingDisplay
                  count={getEngravingSlotCount(slot.key, item!.grade)}
                  engravings={item!.engravings}
                />
              )}
              {equippedSynthesisEffects.length > 0 && (
                <SynthesisEffectsDisplay
                  slotKey={slot.key}
                  effectIds={equippedSynthesisEffects}
                />
              )}
              {equippedCursedSynthesisEffects.length > 0 && (
                <CursedArmorSynthesisDisplay
                  effectIds={equippedCursedSynthesisEffects}
                />
              )}
              {equippedRingSynthesisEffects.length > 0 && (
                <RingSynthesisDisplay
                  effectIds={equippedRingSynthesisEffects}
                />
              )}
              {item && hasEphenSynthesisSelection(item) && (
                <EphenSynthesisDisplay item={item} />
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Пусто</div>
          )}
        </DialogContent>
      </Dialog>
      {equippedRune && (
        <RuneTooltip
          rune={equippedRune}
          side={tooltipSide}
          equipment={equipment}
        >
          <div
            className={`absolute top-1/2 flex size-7 -translate-y-1/2 cursor-default items-center justify-center overflow-hidden rounded-md border border-border bg-background shadow-sm ${
              tooltipSide === "left" ? "-left-8" : "-right-8"
            }`}
          >
            <RuneIcon rune={equippedRune} size={24} />
          </div>
        </RuneTooltip>
      )}
    </div>
  );
}

export default function EquipmentTab({
  userId,
  user,
  equipment,
  seals,
  onChange,
  canEdit,
}: {
  userId: number;
  user: any;
  equipment: UserEquipment[];
  seals: UserSeal[];
  onChange: (equipment: UserEquipment[]) => void;
  canEdit: boolean;
}) {
  const equipmentBySlot = Object.fromEntries(
    equipment.map((e) => [e.slot, e]),
  ) as Record<string, UserEquipment>;

  const [level, setLevel] = useState(user?.character_level ?? 1);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(
    user?.character_portrait_url ?? null,
  );

  const handleSaveSlot = async (
    slotKey: string,
    itemName: string,
    grade: number,
    enchant: number,
    extraProtection: number,
    engravings: number[],
    runeId: number,
    synthesisEffects: number[],
    cursedSynthesisEffects: number[],
    ringSynthesisEffects: number[],
    ephenSynthesisPercent: number,
    ephenSynthesisPrimary: string,
    ephenSynthesisSecondary: string,
    ephenSynthesisTertiary: string[],
  ) => {
    const payload: EquipmentInput[] = EQUIPMENT_SLOTS.map((slot) => {
      const existing = equipmentBySlot[slot.key];
      if (slot.key === slotKey) {
        return {
          slot: slot.key,
          itemName,
          grade,
          enchant,
          extraProtection,
          engravings,
          runeId,
          costumeSynthesisEffects:
            slotKey === "costume" ? synthesisEffects : [],
          underwearSynthesisEffects:
            slotKey === "underwear" ? synthesisEffects : [],
          cursedSynthesisEffects,
          ringSynthesisEffects,
          ephenSynthesisPercent,
          ephenSynthesisPrimary,
          ephenSynthesisSecondary,
          ephenSynthesisTertiary,
          epheSealLevel: existing?.ephe_seal_level ?? 0,
        };
      }
      return {
        slot: slot.key,
        itemName: existing?.item_name ?? "",
        grade: existing?.grade ?? DEFAULT_GRADE,
        enchant: existing?.enchant ?? DEFAULT_ENCHANT,
        extraProtection: existing?.extra_protection ?? DEFAULT_EXTRA_PROTECTION,
        engravings: existing?.engravings ?? [],
        runeId: existing?.rune_id ?? 0,
        costumeSynthesisEffects: existing?.costume_synthesis_effects ?? [],
        underwearSynthesisEffects: existing?.underwear_synthesis_effects ?? [],
        cursedSynthesisEffects: existing?.cursed_synthesis_effects ?? [],
        ringSynthesisEffects: existing?.ring_synthesis_effects ?? [],
        ephenSynthesisPercent: existing?.ephen_synthesis_percent ?? 0,
        ephenSynthesisPrimary: existing?.ephen_synthesis_primary ?? "",
        ephenSynthesisSecondary: existing?.ephen_synthesis_secondary ?? "",
        ephenSynthesisTertiary: existing?.ephen_synthesis_tertiary ?? [],
        epheSealLevel: existing?.ephe_seal_level ?? 0,
      };
    });

    try {
      const updated = await saveUserEquipment(userId, payload);
      onChange(updated);
      toast.success("Экипировка сохранена");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить экипировку",
      );
    }
  };

  return (
    <Card className="min-h-[750px] gap-3 py-4">
      <CardHeader className="border-b">
        <CardTitle>
          <CharacterTabsSwitcher />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4 lg:flex-row">
        <div className="flex flex-col">
          <div className="mb-2 text-sm font-semibold">
            Характеристики персонажа
          </div>
          <CharacterStatsPanel
            userId={userId}
            equipment={equipment}
            seals={seals}
            user={user}
            canEdit={canEdit}
            level={level}
            onLevelChange={setLevel}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-3 flex justify-center">
            <EquipmentSlotButton
              slot={TOP}
              item={equipmentBySlot[TOP.key]}
              equipment={equipment}
              canEdit={canEdit}
              onSave={(
                itemName,
                grade,
                enchant,
                extraProtection,
                engravings,
                runeId,
                synthesisEffects,
                cursedSynthesisEffects,
                ringSynthesisEffects,
                ephenSynthesisPercent,
                ephenSynthesisPrimary,
                ephenSynthesisSecondary,
                ephenSynthesisTertiary,
              ) =>
                handleSaveSlot(
                  TOP.key,
                  itemName,
                  grade,
                  enchant,
                  extraProtection,
                  engravings,
                  runeId,
                  synthesisEffects,
                  cursedSynthesisEffects,
                  ringSynthesisEffects,
                  ephenSynthesisPercent,
                  ephenSynthesisPrimary,
                  ephenSynthesisSecondary,
                  ephenSynthesisTertiary,
                )
              }
            />
          </div>

          <div className="flex items-stretch justify-center gap-2 sm:gap-6">
            <div className="flex flex-col gap-4">
              {LEFT.map((slot) => (
                <EquipmentSlotButton
                  key={slot.key}
                  slot={slot}
                  item={equipmentBySlot[slot.key]}
                  equipment={equipment}
                  canEdit={canEdit}
                  onSave={(
                    itemName,
                    grade,
                    enchant,
                    extraProtection,
                    engravings,
                    runeId,
                    synthesisEffects,
                    cursedSynthesisEffects,
                    ringSynthesisEffects,
                    ephenSynthesisPercent,
                    ephenSynthesisPrimary,
                    ephenSynthesisSecondary,
                    ephenSynthesisTertiary,
                  ) =>
                    handleSaveSlot(
                      slot.key,
                      itemName,
                      grade,
                      enchant,
                      extraProtection,
                      engravings,
                      runeId,
                      synthesisEffects,
                      cursedSynthesisEffects,
                      ringSynthesisEffects,
                      ephenSynthesisPercent,
                      ephenSynthesisPrimary,
                      ephenSynthesisSecondary,
                      ephenSynthesisTertiary,
                    )
                  }
                />
              ))}
            </div>

            {portraitUrl ? (
              <div className="relative flex w-40 flex-col rounded-xl border bg-muted/40 p-3 sm:w-[300px]">
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <Image
                    src={portraitUrl}
                    alt={user?.username ?? ""}
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                </div>
                {canEdit && (
                  <CharacterPortraitUpload
                    userId={userId}
                    onUploaded={setPortraitUrl}
                  />
                )}
              </div>
            ) : (
              <div className="relative flex w-32 flex-col items-center justify-center gap-2 rounded-xl border bg-muted/40 p-3 sm:w-56">
                <Avatar className="size-16 border-4 border-card shadow-sm sm:size-24">
                  <AvatarImage
                    src={
                      user?.avatar_url ??
                      `https://api.dicebear.com/6.x/initials/svg?seed=${user?.username ?? "?"}`
                    }
                    alt={user?.username ?? ""}
                  />
                  <AvatarFallback className="text-xl">
                    {user?.username?.slice(0, 2) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-full truncate text-center text-sm font-medium">
                  {user?.username}
                </div>
                {canEdit && (
                  <CharacterPortraitUpload
                    userId={userId}
                    onUploaded={setPortraitUrl}
                  />
                )}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {RIGHT.map((slot) => (
                <EquipmentSlotButton
                  key={slot.key}
                  slot={slot}
                  item={equipmentBySlot[slot.key]}
                  equipment={equipment}
                  canEdit={canEdit}
                  tooltipSide="right"
                  onSave={(
                    itemName,
                    grade,
                    enchant,
                    extraProtection,
                    engravings,
                    runeId,
                    synthesisEffects,
                    cursedSynthesisEffects,
                    ringSynthesisEffects,
                    ephenSynthesisPercent,
                    ephenSynthesisPrimary,
                    ephenSynthesisSecondary,
                    ephenSynthesisTertiary,
                  ) =>
                    handleSaveSlot(
                      slot.key,
                      itemName,
                      grade,
                      enchant,
                      extraProtection,
                      engravings,
                      runeId,
                      synthesisEffects,
                      cursedSynthesisEffects,
                      ringSynthesisEffects,
                      ephenSynthesisPercent,
                      ephenSynthesisPrimary,
                      ephenSynthesisSecondary,
                      ephenSynthesisTertiary,
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold">
            Подробные характеристики
          </div>
          <DetailedStatsPanel equipment={equipment} level={level} />
        </div>
      </CardContent>
    </Card>
  );
}
