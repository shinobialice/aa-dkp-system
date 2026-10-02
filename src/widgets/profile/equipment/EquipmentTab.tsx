"use client";
import { useState, useSyncExternalStore } from "react";
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
import { classColors } from "@/widgets/MembersTable/classStyles";
import { cn } from "@/shared/lib/tw-merge";
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

const LIST_GROUPS = [
  {
    title: "Доспехи",
    slots: slotsFor([
      "head",
      "chest",
      "belt",
      "bracers",
      "hands",
      "legs",
      "feet",
    ]),
  },
  {
    title: "Плащ, костюм и бельё",
    slots: slotsFor(["cloak", "costume", "underwear"]),
  },
  {
    title: "Украшения",
    slots: slotsFor(["necklace", "earring1", "earring2", "ring1", "ring2"]),
  },
  {
    title: "Оружие и инструмент",
    slots: slotsFor([
      "weapon_main",
      "weapon_off",
      "weapon_ranged",
      "instrument",
    ]),
  },
];

const NARROW_QUERY = "(max-width: 639px)";

function subscribeNarrow(onChange: () => void) {
  const query = window.matchMedia(NARROW_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useNarrowScreen() {
  return useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(NARROW_QUERY).matches,
    () => false,
  );
}

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
}: {
  count: number;
  engravings: number[];
  selectedEngravingId: number;
  onToggle: (index: number) => void;
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

function ItemCard({
  slot,
  item,
  selectedGearItem,
  equipment,
}: {
  slot: EquipmentSlot;
  item: UserEquipment | undefined;
  selectedGearItem: NonNullable<ReturnType<typeof findGearItem>>;
  equipment: UserEquipment[];
}) {
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

      {getEngravingSlotCount(slot.key, item?.grade ?? DEFAULT_GRADE) > 0 && (
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
          <RingSynthesisDisplay effectIds={equippedRingSynthesisEffects} />
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
  );
}

function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-[12.5px] font-semibold text-muted-foreground">
      <span>{children}</span>
      {hint && <span className="font-normal">{hint}</span>}
    </div>
  );
}

function Stepper({
  label,
  hint,
  value,
  max,
  format,
  onChange,
  showMax,
}: {
  label: string;
  hint: string;
  value: number;
  max: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
  showMax?: boolean;
}) {
  const set = (next: number) => onChange(Math.max(0, Math.min(max, next)));
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <div className="flex h-10 items-center overflow-hidden rounded-lg border bg-input/30">
        <button
          type="button"
          aria-label={`${label}: меньше`}
          onClick={() => set(value - 1)}
          disabled={value <= 0}
          className="flex h-full w-10 cursor-pointer items-center justify-center text-lg hover:bg-muted disabled:cursor-default disabled:opacity-40"
        >
          −
        </button>
        <span className="flex-1 text-center text-base font-extrabold tabular-nums">
          {format(value)}
        </span>
        <button
          type="button"
          aria-label={`${label}: больше`}
          onClick={() => set(value + 1)}
          disabled={value >= max}
          className="flex h-full w-10 cursor-pointer items-center justify-center text-lg hover:bg-muted disabled:cursor-default disabled:opacity-40"
        >
          +
        </button>
      </div>
      {showMax && (
        <div className="flex items-center gap-2">
          <span className="block h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-green-500"
              style={{ width: `${max ? (value / max) * 100 : 0}%` }}
            />
          </span>
          <button
            type="button"
            onClick={() => set(max)}
            className="cursor-pointer text-xs font-semibold text-green-500 hover:underline"
          >
            Макс
          </button>
        </div>
      )}
    </div>
  );
}

function EquipmentSlotButton({
  slot,
  item,
  equipment,
  canEdit,
  onSave,
  tooltipSide = "left",
  showRune = true,
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
  showRune?: boolean;
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
  const [previewOpen, setPreviewOpen] = useState(false);

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

  const draftRune = runeId ? findRune(runeId) : undefined;
  const draftItem = {
    ...(item ?? {}),
    slot: slot.key,
    item_name: itemName,
    grade,
    enchant,
    extra_protection: extraProtection,
    engravings: engravings.slice(0, maxEngravingSlots),
    rune_id: runeId,
    costume_synthesis_effects: slot.key === "costume" ? synthesisEffects : [],
    underwear_synthesis_effects:
      slot.key === "underwear" ? synthesisEffects : [],
    cursed_synthesis_effects: cursedSynthesisEffects.filter((id) => id >= 0),
    ring_synthesis_effects: isRingSynthDraft ? ringSynthesisEffects : [],
    ephen_synthesis_percent: ephenSynthesisEligible ? ephenSynthesisPercent : 0,
    ephen_synthesis_primary: ephenSynthesisEligible
      ? ephenSynthesisPrimary
      : "",
    ephen_synthesis_secondary: ephenSynthesisEligible
      ? ephenSynthesisSecondary
      : "",
    ephen_synthesis_tertiary: ephenSynthesisEligible
      ? ephenSynthesisTertiary
      : [],
  } as UserEquipment;

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
      setSelectedEngravingId(item?.engravings?.find(Boolean) ?? 0);
      setPreviewOpen(false);
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
      {selectedGearItem && (item?.enchant ?? 0) > 0 && (
        <span className="pointer-events-none absolute -bottom-1.5 -left-1 z-10 rounded bg-green-600 px-1 text-[10px] leading-[15px] font-extrabold text-white shadow-sm">
          +{item?.enchant}
        </span>
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
              <ItemCard
                slot={slot}
                item={item}
                selectedGearItem={selectedGearItem}
                equipment={equipment}
              />
            </TooltipContent>
          </Tooltip>
        ) : (
          <DialogTrigger asChild>{button}</DialogTrigger>
        )}
        <DialogContent
          aria-describedby={undefined}
          className={cn(
            "dark flex flex-col gap-0 overflow-hidden border-border bg-background p-0 text-foreground",
            canEdit
              ? "h-[100dvh] max-h-[100dvh] w-full max-w-none rounded-none sm:h-auto sm:max-h-[90dvh] sm:max-w-4xl sm:rounded-xl"
              : "w-full max-w-2xl",
          )}
        >
          <DialogHeader className="shrink-0 gap-0.5 border-b px-5 py-4 pr-12 text-left">
            <DialogTitle>{slot.label}</DialogTitle>
            {canEdit && (
              <p className="text-[13px] text-muted-foreground">
                Изменения видны в карточке сразу, сохраняются кнопкой внизу
              </p>
            )}
          </DialogHeader>

          {canEdit ? (
            <>
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:grid md:grid-cols-[minmax(0,1fr)_320px] md:overflow-hidden">
                {draftGearItem && (
                  <div className="border-b px-5 py-3 md:order-2 md:min-h-0 md:overflow-y-auto md:border-b-0 md:border-l md:py-4">
                    <button
                      type="button"
                      aria-expanded={previewOpen}
                      onClick={() => setPreviewOpen((value) => !value)}
                      className="flex w-full cursor-pointer items-center justify-between text-[12.5px] font-semibold text-muted-foreground md:pointer-events-none md:mb-2 md:cursor-default"
                    >
                      Как будет выглядеть
                      <span className="text-xs font-normal md:hidden">
                        {previewOpen ? "Скрыть" : "Показать"}
                      </span>
                    </button>
                    <div
                      className={cn(
                        "mt-2 rounded-xl border bg-card/40 p-3 md:mt-0 md:block",
                        !previewOpen && "hidden",
                      )}
                    >
                      <ItemCard
                        slot={slot}
                        item={draftItem}
                        selectedGearItem={draftGearItem}
                        equipment={equipment}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-4 px-5 py-4 md:order-1 md:min-h-0 md:overflow-y-auto">
                  <div className="space-y-1.5">
                    <FieldLabel>Предмет</FieldLabel>
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
                      <FieldLabel>Качество</FieldLabel>
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
                                    optionColor
                                      ? { color: optionColor }
                                      : undefined
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

                  {itemName.trim() !== "" &&
                    CUBE_ELIGIBLE_SLOTS.has(slot.key) && (
                      <div className="grid grid-cols-2 gap-3">
                        <Stepper
                          label="Куб"
                          hint={`макс. ${MAX_ENCHANT}`}
                          value={enchant}
                          max={MAX_ENCHANT}
                          format={(value) => `+${value}`}
                          onChange={(value) => {
                            if (isValidEnchantLevel(value)) setEnchant(value);
                          }}
                          showMax
                        />
                        <Stepper
                          label="Защита от доп. урона"
                          hint={`ур. 0–${getMaxExtraProtectionLevel(slot.key)}`}
                          value={extraProtection}
                          max={getMaxExtraProtectionLevel(slot.key)}
                          format={(value) => `Lv. ${value}`}
                          onChange={(value) => {
                            if (isValidExtraProtectionLevel(value, slot.key))
                              setExtraProtection(value);
                          }}
                        />
                      </div>
                    )}
                  {itemName.trim() !== "" && maxEngravingSlots > 0 && (
                    <div className="space-y-2">
                      <FieldLabel
                        hint={
                          <span className="flex gap-3">
                            <button
                              type="button"
                              disabled={!selectedEngravingId}
                              onClick={() =>
                                setEngravings(
                                  Array.from(
                                    { length: maxEngravingSlots },
                                    () => selectedEngravingId,
                                  ),
                                )
                              }
                              className="cursor-pointer text-xs font-semibold text-green-500 hover:underline disabled:cursor-default disabled:opacity-40 disabled:hover:no-underline"
                            >
                              Заполнить все
                            </button>
                            <button
                              type="button"
                              onClick={() => setEngravings([])}
                              className="cursor-pointer text-xs font-semibold text-red-400 hover:underline"
                            >
                              Снять все
                            </button>
                          </span>
                        }
                      >
                        Гравировки ·{" "}
                        {
                          engravings.slice(0, maxEngravingSlots).filter(Boolean)
                            .length
                        }{" "}
                        / {maxEngravingSlots}
                      </FieldLabel>
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
                      />
                      <p className="text-xs text-muted-foreground">
                        Клик по пустой ячейке ставит выбранную гравировку, по
                        заполненной — снимает её
                      </p>
                    </div>
                  )}
                  {itemName.trim() !== "" && (
                    <div className="space-y-1.5">
                      <FieldLabel>Лунный камень / руна</FieldLabel>
                      <RunePicker
                        slot={slot.key}
                        handedness={draftHandedness}
                        itemId={draftGearItem?.id}
                        value={runeId}
                        onSelect={setRuneId}
                        equipment={equipment}
                      />
                      {draftRune?.effect && (
                        <div className="space-y-0.5 text-xs text-green-500">
                          <EffectText text={draftRune.effect} />
                        </div>
                      )}
                    </div>
                  )}

                  {draftSynthesisRole && (
                    <div className="space-y-1.5">
                      <FieldLabel>Эффекты синтеза</FieldLabel>
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
                      <FieldLabel>Эффекты синтеза</FieldLabel>
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
                      <FieldLabel>Эффекты синтеза</FieldLabel>
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
                          {getSealGradeLabel(ephenSynthesisCategory.minGrade)}»
                          — выберите качество выше.
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
                                Первый пул (выбрано{" "}
                                {ephenSynthesisTertiary.length}/
                                {ephenSynthesisCategory.groups[0].pickCount})
                              </div>
                              <div className="max-h-48 space-y-0.5 overflow-y-auto rounded-md border p-1">
                                {ephenSynthesisCategory.groups[0].options.map(
                                  (option) => {
                                    const checked =
                                      ephenSynthesisTertiary.includes(
                                        option.key,
                                      );
                                    const pickCount =
                                      ephenSynthesisCategory.groups[0]
                                        .pickCount;
                                    const disabled =
                                      !checked &&
                                      ephenSynthesisTertiary.length >=
                                        pickCount;
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
                                            (option) =>
                                              option.key !== otherValue,
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
                                        ephenSynthesisTertiary.includes(
                                          option.key,
                                        );
                                      const pickCount =
                                        ephenSynthesisCategory.groups[2]
                                          .pickCount;
                                      const disabled =
                                        !checked &&
                                        ephenSynthesisTertiary.length >=
                                          pickCount;
                                      const range =
                                        getEphenSynthesisOptionRange(
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
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 border-t px-5 py-3">
                {filled && (
                  <Button
                    variant="ghost"
                    aria-label="Снять предмет"
                    className="h-11 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive sm:h-9"
                    onClick={handleClear}
                    disabled={saving}
                  >
                    <Trash2 />
                    <span className="hidden sm:inline">Снять предмет</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="ml-auto hidden cursor-pointer sm:inline-flex"
                  onClick={() => handleOpenChange(false)}
                  disabled={saving}
                >
                  Отмена
                </Button>
                <Button
                  className="h-11 flex-1 cursor-pointer sm:h-9 sm:flex-none"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </>
          ) : filled ? (
            <div className="space-y-1.5 overflow-y-auto px-5 py-4">
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
            <div className="px-5 py-4 text-sm text-muted-foreground">Пусто</div>
          )}
        </DialogContent>
      </Dialog>
      {showRune && equippedRune && (
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
  const narrow = useNarrowScreen();
  const [viewOverride, setViewOverride] = useState<"doll" | "list" | null>(
    null,
  );
  const view = viewOverride ?? (narrow ? "list" : "doll");

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

  const renderSlot = (
    slot: EquipmentSlot,
    side: "left" | "right" = "left",
    showRune = true,
  ) => (
    <EquipmentSlotButton
      key={slot.key}
      slot={slot}
      item={equipmentBySlot[slot.key]}
      equipment={equipment}
      canEdit={canEdit}
      tooltipSide={side}
      showRune={showRune}
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
  );

  const filledCount = EQUIPMENT_SLOTS.filter(
    (slot) => equipmentBySlot[slot.key]?.item_name,
  ).length;

  return (
    <Card className="@container gap-0 py-0">
      <CardHeader className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-3 py-3 sm:px-4 [.border-b]:pb-3">
        <CardTitle className="min-w-0">
          <CharacterTabsSwitcher />
        </CardTitle>
        <div className="ml-auto flex items-center gap-2 text-[13px] text-muted-foreground">
          {user?.class && (
            <span
              className="rounded-full px-2.5 py-0.5 font-semibold"
              style={{
                color: classColors[user.class],
                backgroundColor: `color-mix(in srgb, ${classColors[user.class] ?? "#71717a"} 12%, transparent)`,
              }}
            >
              {user.class}
            </span>
          )}
          <span>
            ур. <b className="text-foreground">{level}</b>
          </span>
          <span>·</span>
          <span>
            {filledCount} из {EQUIPMENT_SLOTS.length} ячеек
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-3 sm:p-4 @[48rem]:grid-cols-2 @[60rem]:grid-cols-[280px_minmax(0,1fr)_300px] @[60rem]:items-start">
        <div className="flex min-w-0 flex-col">
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

        <div className="flex min-w-0 flex-col gap-3 @[48rem]:order-first @[48rem]:col-span-2 @[60rem]:order-none @[60rem]:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold">Экипировка</span>
            <div
              role="tablist"
              aria-label="Вид экипировки"
              className="inline-flex gap-0.5 rounded-lg bg-muted p-[3px]"
            >
              {(
                [
                  ["doll", "Кукла"],
                  ["list", "Списком"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={view === key}
                  onClick={() => setViewOverride(key)}
                  className={cn(
                    "h-8 cursor-pointer rounded-md px-3 text-[12.5px] font-semibold transition-colors sm:h-7",
                    view === key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {view === "list" ? (
            <div className="flex flex-col gap-3">
              {LIST_GROUPS.map((group) => (
                <div key={group.title} className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {group.title}
                  </span>
                  <div className="flex flex-col divide-y overflow-hidden rounded-xl border">
                    {group.slots.map((slot) => {
                      const item = equipmentBySlot[slot.key];
                      const gear = findGearItem(slot.key, item?.item_name);
                      const rune = item?.rune_id
                        ? findRune(item.rune_id)
                        : undefined;
                      const color = item?.item_name
                        ? getSealGradeColor(item.grade)
                        : null;
                      return (
                        <div
                          key={slot.key}
                          className="flex items-center gap-3 px-2.5 py-2"
                        >
                          {renderSlot(slot, "right", false)}
                          <span className="flex min-w-0 flex-1 flex-col leading-tight">
                            <span className="text-[11.5px] text-muted-foreground">
                              {slot.label}
                            </span>
                            {item?.item_name ? (
                              <>
                                <span
                                  className="text-[13.5px] font-semibold"
                                  style={{ color: color ?? undefined }}
                                >
                                  {item.enchant > 0 && `+${item.enchant} `}
                                  {gear?.name ?? item.item_name}
                                </span>
                                <span className="text-[11.5px] text-muted-foreground">
                                  {getSealGradeLabel(item.grade)}
                                  {rune && ` · ${rune.name}`}
                                </span>
                              </>
                            ) : (
                              <span className="text-[13px] text-muted-foreground">
                                Пусто
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-3 flex justify-center">{renderSlot(TOP)}</div>

              <div className="flex w-full items-stretch justify-center gap-2 sm:gap-3">
                <div className="flex flex-col gap-4 pl-8">
                  {LEFT.map((slot) => renderSlot(slot, "left"))}
                </div>

                {portraitUrl ? (
                  <div className="relative flex w-40 flex-col rounded-xl border bg-muted/40 p-2 sm:w-[240px] @[60rem]:w-[190px]">
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
                  <div className="relative flex w-32 flex-col items-center justify-center gap-2 rounded-xl border bg-muted/40 p-3 sm:w-52">
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

                <div className="flex flex-col gap-4 pr-8">
                  {RIGHT.map((slot) => renderSlot(slot, "right"))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <DetailedStatsPanel equipment={equipment} level={level} />
        </div>
      </CardContent>
    </Card>
  );
}
