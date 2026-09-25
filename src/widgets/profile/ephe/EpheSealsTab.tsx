"use client";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import saveEpheSealLevel from "@/actions/saveEpheSealLevel";
import maxAllEpheSealLevels from "@/actions/maxAllEpheSealLevels";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { EQUIPMENT_SLOTS } from "../equipment/equipmentData";
import { findGearItem } from "../equipment/itemsData";
import { getSealGradeColor, getSealGradeLabel } from "../seals/sealsData";
import {
  EPHE_SLOT_TRACK,
  EPHE_TRACK_MAX_LEVEL,
  EPHE_TRACK_PERCENT_CATEGORY,
  getEpheTrackLevels,
  getEpheEffectiveness,
  getEphePercentBonus,
} from "./epheSealsData";
import { getEpheItemTier } from "./epheSealsBonus";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import CharacterTabsSwitcher from "@/widgets/profile/CharacterTabsSwitcher";

const CHECK_COLOR = "#4ade80";

const EPHE_SLOT_SHORT_LABELS: Record<string, string> = {
  weapon_main: "Правая рука",
  weapon_off: "Левая рука",
  weapon_ranged: "Дальний бой",
  head: "Шлем",
  chest: "Нагрудник",
  legs: "Поножи",
  hands: "Перчатки",
  feet: "Сапоги",
  belt: "Пояс",
  bracers: "Наручи",
  necklace: "Ожерелье",
  earring1: "Серьга (левая)",
  earring2: "Серьга (правая)",
  ring1: "Кольцо (левое)",
  ring2: "Кольцо (правое)",
  instrument: "Инструмент",
};

const EPHE_SIDEBAR_GROUPS: { label: string; slots: string[] }[] = [
  {
    label: "Печать Эфе (оружие)",
    slots: ["weapon_main", "weapon_off", "weapon_ranged"],
  },
  {
    label: "Печать Эфе (доспехи)",
    slots: ["head", "chest", "legs", "hands", "feet", "belt", "bracers"],
  },
  {
    label: "Печать Эфе (украшения)",
    slots: ["necklace", "earring1", "earring2", "ring1", "ring2", "instrument"],
  },
];

const TIER_LABELS = {
  default: "РБ",
  ephen: "Эфенское",
  ramian: "Рамианское/данж.",
};

export default function EpheSealsTab({
  userId,
  equipment,
  onChange,
  canEdit,
}: {
  userId: number;
  equipment: UserEquipment[];
  onChange: (equipment: UserEquipment[]) => void;
  canEdit: boolean;
}) {
  const [activeSlot, setActiveSlot] = useState<string>(
    EPHE_SIDEBAR_GROUPS[0].slots[0],
  );
  const [saving, setSaving] = useState(false);
  const [maxingAll, setMaxingAll] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const equipmentBySlot = Object.fromEntries(
    equipment.map((e) => [e.slot, e]),
  ) as Record<string, UserEquipment>;

  const handleSelectLevel = async (slot: string, level: number) => {
    setSaving(true);
    try {
      const updated = await saveEpheSealLevel(userId, slot, level);
      onChange(updated);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить печать Эфе",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleMaxAll = async () => {
    setMaxingAll(true);
    try {
      const updated = await maxAllEpheSealLevels(userId);
      onChange(updated);
      toast.success("Все печати Эфе прокачаны до максимума");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Не удалось прокачать печати Эфе",
      );
    } finally {
      setMaxingAll(false);
    }
  };

  const activeSlotInfo = EQUIPMENT_SLOTS.find((s) => s.key === activeSlot)!;
  const activeEq = equipmentBySlot[activeSlot];
  const activeTrack = EPHE_SLOT_TRACK[activeSlot];
  const activeLevel = activeEq?.ephe_seal_level ?? 0;
  const maxLevel = EPHE_TRACK_MAX_LEVEL[activeTrack];
  const rows = getEpheTrackLevels(activeTrack);
  const percentCategory = EPHE_TRACK_PERCENT_CATEGORY[activeTrack];

  const gearItem = activeEq
    ? findGearItem(activeSlot, activeEq.item_name)
    : undefined;
  const effectiveness = getEpheEffectiveness(activeTrack, activeLevel);
  const tier = gearItem ? getEpheItemTier(gearItem.id) : "default";
  const percentBonus =
    percentCategory && effectiveness > 0
      ? getEphePercentBonus(percentCategory, tier, effectiveness)
      : 0;

  return (
    <Card className="min-h-[750px] gap-3 py-4">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between gap-2">
          <CharacterTabsSwitcher />
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleMaxAll}
              disabled={maxingAll}
            >
              {maxingAll ? "Прокачка..." : "Замаксить всё"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4 lg:flex-row">
        <div className="flex w-full flex-col gap-2 lg:w-64 lg:shrink-0">
          {EPHE_SIDEBAR_GROUPS.map((group) => {
            const isCollapsed = collapsed[group.label];
            return (
              <div key={group.label}>
                <button
                  type="button"
                  onClick={() =>
                    setCollapsed((prev) => ({
                      ...prev,
                      [group.label]: !prev[group.label],
                    }))
                  }
                  className="flex w-full cursor-pointer items-center gap-1.5 px-1 py-1 text-left text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  {isCollapsed ? (
                    <ChevronRight className="size-4 shrink-0" />
                  ) : (
                    <ChevronDown className="size-4 shrink-0" />
                  )}
                  {group.label}
                </button>
                {!isCollapsed && (
                  <div className="flex flex-col gap-1">
                    {group.slots.map((slotKey) => {
                      const eq = equipmentBySlot[slotKey];
                      const level = eq?.ephe_seal_level ?? 0;
                      const max =
                        EPHE_TRACK_MAX_LEVEL[EPHE_SLOT_TRACK[slotKey]];
                      return (
                        <button
                          key={slotKey}
                          type="button"
                          onClick={() => setActiveSlot(slotKey)}
                          className={`flex cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm ${
                            activeSlot === slotKey
                              ? "border-primary bg-accent"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <Check
                              className="size-3.5 shrink-0"
                              style={{
                                color: eq
                                  ? CHECK_COLOR
                                  : "var(--muted-foreground)",
                              }}
                              strokeWidth={eq ? 3 : 1.5}
                            />
                            <span className="truncate">
                              {EPHE_SLOT_SHORT_LABELS[slotKey]}
                            </span>
                          </span>
                          <Badge variant={level > 0 ? "default" : "outline"}>
                            {level}/{max}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="min-w-0 flex-1">
          {!activeEq ? (
            <div className="flex h-full min-h-[300px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
              В слоте «{activeSlotInfo.label}» нет предмета — сначала экипируйте
              его во вкладке «Экипировка».
            </div>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  <span className="font-semibold">{activeSlotInfo.label}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    — выбрано до уровня {activeLevel} / {maxLevel}
                  </span>
                  {percentCategory && (
                    <span className="text-muted-foreground">
                      {" "}
                      · эффективность {effectiveness.toFixed(1)} · бонус +
                      {percentBonus.toFixed(2)}% ({TIER_LABELS[tier]})
                    </span>
                  )}
                </div>
                {canEdit && activeLevel > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => handleSelectLevel(activeSlot, 0)}
                    disabled={saving}
                  >
                    Сбросить слот
                  </Button>
                )}
              </div>
              <div className="max-h-[600px] overflow-y-auto rounded-md border">
                {rows.map((row, idx) => {
                  const gradeColor = getSealGradeColor(row.grade + 1);
                  const isFirstOfGrade =
                    idx === 0 || rows[idx - 1].grade !== row.grade;
                  const achieved = row.level <= activeLevel;
                  const isCurrent = row.level === activeLevel;
                  const editable = canEdit && !saving;
                  return (
                    <div key={row.level}>
                      {isFirstOfGrade && (
                        <div
                          className="sticky top-0 border-y bg-muted/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm"
                          style={{ color: gradeColor ?? undefined }}
                        >
                          {getSealGradeLabel(row.grade + 1)}
                        </div>
                      )}
                      <div
                        role={editable ? "button" : undefined}
                        tabIndex={editable ? 0 : undefined}
                        onClick={
                          editable
                            ? () => handleSelectLevel(activeSlot, row.level)
                            : undefined
                        }
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
                          <span className="truncate">
                            {row.type === "improvement"
                              ? "Улучшение ячейки"
                              : row.stat}
                          </span>
                        </span>
                        <span className="shrink-0 tabular-nums">
                          {row.type === "improvement"
                            ? "+0.1"
                            : `+${row.value}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
