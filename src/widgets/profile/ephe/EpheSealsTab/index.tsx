"use client";
import { useState } from "react";
import { toast } from "sonner";
import saveEpheSealLevel, {
  type EpheSealsUpdate,
} from "@/actions/saveEpheSealLevel";
import maxAllEpheSealLevels from "@/actions/maxAllEpheSealLevels";
import type { ProfileUser } from "@/actions/getUser";
import type { UserArchetype } from "@/actions/getUserArchetype";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserEpheSeals } from "@/actions/getUserEpheSeals";
import { getEquipmentSlot } from "../../equipment/equipmentData";
import {
  EPHE_SLOT_TRACK,
  EPHE_TRACK_MAX_LEVEL,
  getEpheTrackLevels,
} from "../epheSealsData";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { Button } from "@/shared/ui";
import CharacterTabsSwitcher from "@/widgets/profile/CharacterTabsSwitcher";
import { errorMessage } from "@/shared/lib/errorMessage";
import EpheSidebar from "../EpheSidebar";
import EpheLevelList from "../EpheLevelList";
import EpheSlotUsageList from "../EpheSlotUsageList";
import { EPHE_SIDEBAR_GROUPS } from "../epheSlotGroups";
import {
  getEpheCoverage,
  getEpheRoles,
  getEpheSlotUsage,
} from "../epheSlotUsage";

type Props = {
  user: ProfileUser;
  archetype: UserArchetype;
  epheSeals: UserEpheSeals;
  equipment: UserEquipment[];
  onChange: (update: EpheSealsUpdate) => void;
  canEdit: boolean;
};

export default function EpheSealsTab({
  user,
  archetype,
  epheSeals,
  equipment,
  onChange,
  canEdit,
}: Props) {
  const [activeSlot, setActiveSlot] = useState<string>(
    EPHE_SIDEBAR_GROUPS[0].slots[0],
  );
  const [saving, setSaving] = useState(false);
  const [maxingAll, setMaxingAll] = useState(false);

  const handleSelectLevel = async (level: number) => {
    setSaving(true);
    try {
      onChange(await saveEpheSealLevel(user.id, activeSlot, level));
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить печать Эфе"));
    } finally {
      setSaving(false);
    }
  };

  const handleMaxAll = async () => {
    setMaxingAll(true);
    try {
      onChange(await maxAllEpheSealLevels(user.id));
      toast.success("Все печати Эфе прокачаны до максимума");
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось прокачать печати Эфе"));
    } finally {
      setMaxingAll(false);
    }
  };

  const roles = getEpheRoles(user, archetype);
  const activeTrack = EPHE_SLOT_TRACK[activeSlot];
  const activeLevel = epheSeals[activeSlot] ?? 0;
  const maxLevel = EPHE_TRACK_MAX_LEVEL[activeTrack];

  return (
    <Card className="min-h-187.5 gap-3 py-4">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between gap-2">
          <CharacterTabsSwitcher group="seals" />
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
          levels={epheSeals}
          coverage={getEpheCoverage(equipment, roles)}
          activeSlot={activeSlot}
          onSelect={setActiveSlot}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm">
              <span className="font-semibold">
                {getEquipmentSlot(activeSlot)?.label}
              </span>
              <span className="text-muted-foreground">
                {" "}
                — выбрано до уровня {activeLevel} / {maxLevel}
              </span>
            </div>
            {canEdit && activeLevel > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => handleSelectLevel(0)}
                disabled={saving}
              >
                Сбросить слот
              </Button>
            )}
          </div>
          <EpheSlotUsageList
            usage={getEpheSlotUsage(equipment, roles, activeSlot)}
          />
          <EpheLevelList
            rows={getEpheTrackLevels(activeTrack)}
            activeLevel={activeLevel}
            editable={canEdit && !saving}
            onSelect={handleSelectLevel}
          />
        </div>
      </CardContent>
    </Card>
  );
}
