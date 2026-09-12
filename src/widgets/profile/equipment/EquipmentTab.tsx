"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import saveUserEquipment, { EquipmentInput } from "@/actions/saveUserEquipment";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { EQUIPMENT_SLOTS, type EquipmentSlot } from "./equipmentData";
import { ITEMS_BY_SLOT, findGearItem } from "./itemsData";
import {
  getEngravingSlotCount,
  getEngravingCategory,
} from "./itemsData/engravingSlots";
import {
  DEFAULT_ENCHANT,
  MAX_ENCHANT,
  isValidEnchantLevel,
  DEFAULT_EXTRA_PROTECTION,
  MAX_EXTRA_PROTECTION,
  isValidExtraProtectionLevel,
} from "./itemsData/statsFormula";
import { GearItemIcon } from "./GearItemIcon";
import { GearItemPicker } from "./GearItemPicker";
import { EngravingPicker, EngravingIcon, EngravingTooltip } from "./EngravingPicker";
import { findEngraving } from "./itemsData/engravings";
import { WEAPON_HANDEDNESS } from "./itemsData/weaponHandedness";
import { highlightNumbers } from "./highlightNumbers";
import { ItemStats } from "./ItemStats";
import { CharacterStatsPanel } from "./CharacterStatsPanel";
import { DetailedStatsPanel } from "./DetailedStatsPanel";
import {
  SEAL_GRADES,
  getSealGradeLabel,
  getSealGradeColor,
} from "@/widgets/profile/seals/sealsData";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
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

// "Проклятого X" / "Возрожденного X" — фиксированные рейдовые сеты, всегда
// Эпохи Двенадцати, качество для них игрок выбрать не может.
function isFixedGradeItemName(name: string): boolean {
  return name.includes("проклятого") || name.includes("возрожденного");
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
              <span className="text-xs text-green-500">
                {highlightNumbers(engraving.effect)}
              </span>
            )}
          </div>
        );
      })}
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

function SetProgress() {
  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold">Эффекты комплекта</div>
      <div className="text-xs text-muted-foreground">В процессе</div>
    </div>
  );
}

function EquipmentSlotButton({
  slot,
  item,
  equipment,
  canEdit,
  onSave,
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
  ) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState(item?.item_name ?? "");
  const [grade, setGrade] = useState(item?.grade ?? DEFAULT_GRADE);
  const [enchant, setEnchant] = useState(item?.enchant ?? DEFAULT_ENCHANT);
  const [extraProtection, setExtraProtection] = useState(
    item?.extra_protection ?? DEFAULT_EXTRA_PROTECTION,
  );
  const [engravings, setEngravings] = useState<number[]>(item?.engravings ?? []);
  const [selectedEngravingId, setSelectedEngravingId] = useState(0);
  const [saving, setSaving] = useState(false);

  const filled = !!item?.item_name;
  const knownItems = ITEMS_BY_SLOT[slot.key];
  const selectedGearItem = findGearItem(slot.key, item?.item_name);
  const draftGearItem = findGearItem(slot.key, itemName);
  const isFixedGradeItem = !!draftGearItem && isFixedGradeItemName(draftGearItem.name);
  const maxEngravingSlots = getEngravingSlotCount(slot.key, grade);
  const draftHandedness = draftGearItem
    ? WEAPON_HANDEDNESS[draftGearItem.id]
    : undefined;

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setItemName(item?.item_name ?? "");
      setGrade(item?.grade ?? DEFAULT_GRADE);
      setEnchant(item?.enchant ?? DEFAULT_ENCHANT);
      setExtraProtection(item?.extra_protection ?? DEFAULT_EXTRA_PROTECTION);
      setEngravings(item?.engravings ?? []);
      setSelectedEngravingId(0);
    }
    setOpen(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(
        itemName,
        grade,
        enchant,
        extraProtection,
        engravings.slice(0, maxEngravingSlots),
      );
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    setSaving(true);
    try {
      await onSave("", DEFAULT_GRADE, DEFAULT_ENCHANT, DEFAULT_EXTRA_PROTECTION, []);
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {selectedGearItem ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{button}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="dark w-64 border-border bg-background p-3 text-foreground"
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

              {ARMOR_SLOTS.has(slot.key) && (
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

              {getEngravingCategory(slot.key) === "armor" && (
                <>
                  <div className="border-t border-border" />
                  <SetProgress />
                </>
              )}
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
                      ? SEAL_GRADES.filter((g) => g.grade === 12)
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
                    else if (e.target.value === "") setEnchant(DEFAULT_ENCHANT);
                  }}
                  className="w-24"
                />
              </div>
            )}

            {itemName.trim() !== "" && ARMOR_SLOTS.has(slot.key) && (
              <div className="space-y-1.5">
                <div className="text-xs text-muted-foreground">Доп.:</div>
                <Input
                  type="number"
                  min={0}
                  max={MAX_EXTRA_PROTECTION}
                  step={1}
                  value={extraProtection}
                  onChange={(e) => {
                    const next = Math.round(Number(e.target.value));
                    if (isValidExtraProtectionLevel(next)) setExtraProtection(next);
                    else if (e.target.value === "")
                      setExtraProtection(DEFAULT_EXTRA_PROTECTION);
                  }}
                  className="w-24"
                />
              </div>
            )}

            {itemName.trim() !== "" && maxEngravingSlots > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs text-muted-foreground">Гравировки:</div>
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
              <Badge variant="outline">{getSealGradeLabel(item!.grade)}</Badge>
              {item!.enchant > 0 && (
                <Badge variant="outline">+{item!.enchant}</Badge>
              )}
            </div>
            {selectedGearItem && ARMOR_SLOTS.has(slot.key) && (
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
            {getEngravingSlotCount(slot.key, item!.grade) > 0 && (
              <EngravingDisplay
                count={getEngravingSlotCount(slot.key, item!.grade)}
                engravings={item!.engravings}
              />
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Пусто</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function EquipmentTab({
  userId,
  user,
  equipment,
  onChange,
  canEdit,
}: {
  userId: number;
  user: any;
  equipment: UserEquipment[];
  onChange: (equipment: UserEquipment[]) => void;
  canEdit: boolean;
}) {
  const equipmentBySlot = Object.fromEntries(
    equipment.map((e) => [e.slot, e]),
  ) as Record<string, UserEquipment>;

  const handleSaveSlot = async (
    slotKey: string,
    itemName: string,
    grade: number,
    enchant: number,
    extraProtection: number,
    engravings: number[],
  ) => {
    const payload: EquipmentInput[] = EQUIPMENT_SLOTS.map((slot) => {
      if (slot.key === slotKey) {
        return { slot: slot.key, itemName, grade, enchant, extraProtection, engravings };
      }
      const existing = equipmentBySlot[slot.key];
      return {
        slot: slot.key,
        itemName: existing?.item_name ?? "",
        grade: existing?.grade ?? DEFAULT_GRADE,
        enchant: existing?.enchant ?? DEFAULT_ENCHANT,
        extraProtection: existing?.extra_protection ?? DEFAULT_EXTRA_PROTECTION,
        engravings: existing?.engravings ?? [],
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
    <Card className="gap-3 py-4">
      <CardHeader className="border-b">
        <CardTitle>Экипировка  (В ПРОЦЕССЕ РАЗРАБОТКИ!!!! Я УЕЗЖАЮ В ИТАЛИЮ!!! ВЕРНУСЬ 24.09 И ДОДЕЛАЮ)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4 lg:flex-row">
        <div className="flex flex-col">
          <div className="mb-2 text-sm font-semibold">
            Характеристики персонажа
          </div>
          <CharacterStatsPanel equipment={equipment} user={user} />
        </div>

        <div className="flex-1">
          <div className="mb-3 flex justify-center">
            <EquipmentSlotButton
              slot={TOP}
              item={equipmentBySlot[TOP.key]}
              equipment={equipment}
              canEdit={canEdit}
              onSave={(itemName, grade, enchant, extraProtection, engravings) =>
                handleSaveSlot(
                  TOP.key,
                  itemName,
                  grade,
                  enchant,
                  extraProtection,
                  engravings,
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
                  onSave={(itemName, grade, enchant, extraProtection, engravings) =>
                    handleSaveSlot(
                      slot.key,
                      itemName,
                      grade,
                      enchant,
                      extraProtection,
                      engravings,
                    )
                  }
                />
              ))}
            </div>

            <div className="flex w-32 flex-col items-center justify-center gap-2 rounded-xl border bg-muted/40 p-3 sm:w-56">
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
            </div>

            <div className="flex flex-col gap-4">
              {RIGHT.map((slot) => (
                <EquipmentSlotButton
                  key={slot.key}
                  slot={slot}
                  item={equipmentBySlot[slot.key]}
                  equipment={equipment}
                  canEdit={canEdit}
                  onSave={(itemName, grade, enchant, extraProtection, engravings) =>
                    handleSaveSlot(
                      slot.key,
                      itemName,
                      grade,
                      enchant,
                      extraProtection,
                      engravings,
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
          <DetailedStatsPanel />
        </div>
      </CardContent>
    </Card>
  );
}
