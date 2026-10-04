"use client";
import { useState } from "react";
import { toast } from "sonner";
import saveEpheSealLevel from "@/actions/saveEpheSealLevel";
import maxAllEpheSealLevels from "@/actions/maxAllEpheSealLevels";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { getEquipmentSlot } from "../../equipment/equipmentData";
import { findGearItem } from "../../equipment/itemsData";
import {
  EPHE_SLOT_TRACK,
  EPHE_TRACK_MAX_LEVEL,
  EPHE_TRACK_PERCENT_CATEGORY,
  getEpheTrackLevels,
  getEpheEffectiveness,
  getEphePercentBonus,
} from "../epheSealsData";
import { getEpheItemTier } from "../epheItemTiers";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { Button } from "@/shared/ui";
import CharacterTabsSwitcher from "@/widgets/profile/CharacterTabsSwitcher";
import { errorMessage } from "@/shared/lib/errorMessage";
import EpheSidebar from "./EpheSidebar";
import EpheLevelList from "./EpheLevelList";
import { EPHE_SIDEBAR_GROUPS, TIER_LABELS } from "./epheSlotGroups";

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

  const equipmentBySlot: Record<string, UserEquipment | undefined> =
    Object.fromEntries(equipment.map((item) => [item.slot, item]));

  const handleSelectLevel = async (slot: string, level: number) => {
    setSaving(true);
    try {
      const updated = await saveEpheSealLevel(userId, slot, level);
      onChange(updated);
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить печать Эфе"));
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
      toast.error(errorMessage(error, "Не удалось прокачать печати Эфе"));
    } finally {
      setMaxingAll(false);
    }
  };

  const activeSlotLabel = getEquipmentSlot(activeSlot)?.label;
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
    <Card className="min-h-187.5 gap-3 py-4">
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
        <EpheSidebar
          equipmentBySlot={equipmentBySlot}
          activeSlot={activeSlot}
          onSelect={setActiveSlot}
        />

        <div className="min-w-0 flex-1">
          {!activeEq ? (
            <div className="flex h-full min-h-75 items-center justify-center px-6 text-center text-sm text-muted-foreground">
              В слоте «{activeSlotLabel}» нет предмета — сначала экипируйте его
              во вкладке «Экипировка».
            </div>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  <span className="font-semibold">{activeSlotLabel}</span>
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
              <EpheLevelList
                rows={rows}
                activeLevel={activeLevel}
                editable={canEdit && !saving}
                onSelect={(level) => handleSelectLevel(activeSlot, level)}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
