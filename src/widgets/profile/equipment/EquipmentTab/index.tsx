"use client";
import { useState } from "react";
import { toast } from "sonner";
import type { ProfileUser } from "@/actions/getUser";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import type { RoleSkillBuild } from "@/actions/getUserSkillBuild";
import type { RoleSlot } from "@/shared/config/roleSlots";
import saveUserEquipment from "@/actions/saveUserEquipment";
import { getGuildBuffSettings } from "@/actions/guildBuffSettings";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Segmented,
} from "@/shared/ui";
import { errorMessage } from "@/shared/lib/errorMessage";
import CharacterTabsSwitcher from "@/widgets/profile/CharacterTabsSwitcher";
import { EQUIPMENT_SLOTS, type EquipmentSlot } from "../equipmentData";
import { CharacterStatsPanel } from "../CharacterStatsPanel";
import { DetailedStatsPanel } from "../DetailedStatsPanel";
import type { SelectedBuffs } from "../characterBuffs";
import EquipmentSlotButton from "./EquipmentSlotButton";
import CharacterDoll from "./CharacterDoll";
import SlotList from "./SlotList";
import { buildEquipmentPayload, type SlotValues } from "./slotValues";
import { useNarrowScreen } from "./useNarrowScreen";
import CopyEquipmentButton from "./CopyEquipmentButton";
import CompareSwitch from "./CompareSwitch";
import ClassBadge from "./ClassBadge";
import { useViewerComparison } from "./useViewerComparison";
import { roleClassOf } from "@/widgets/profile/archetype/archetypeRoles";
import type { EquipmentCopySource } from "../equipmentRoles";

type Props = {
  userId: number;
  roleSlot: RoleSlot;
  copySources: EquipmentCopySource[];
  user: ProfileUser;
  equipment: UserEquipment[];
  seals: UserSeal[];
  skillBuild: RoleSkillBuild;
  buffs: SelectedBuffs;
  onBuffsChange: (buffs: SelectedBuffs) => void;
  onChange: (equipment: UserEquipment[]) => void;
  canEdit: boolean;
};

type View = "doll" | "list";

const VIEW_OPTIONS = [
  { value: "doll" as const, label: "Кукла" },
  { value: "list" as const, label: "Списком" },
];

export default function EquipmentTab({
  userId,
  roleSlot,
  copySources,
  user,
  equipment,
  seals,
  skillBuild,
  buffs,
  onBuffsChange,
  onChange,
  canEdit,
}: Props) {
  const equipmentBySlot: Record<string, UserEquipment | undefined> =
    Object.fromEntries(equipment.map((item) => [item.slot, item]));

  const [level, setLevel] = useState(user.character_level ?? 1);
  const guildBuffs =
    useAsyncData("guild-buffs", getGuildBuffSettings).data ?? {};
  const viewer = useViewerComparison(userId, guildBuffs);
  const [portraitUrl, setPortraitUrl] = useState(user.character_portrait_url);
  const narrow = useNarrowScreen();
  const [viewOverride, setViewOverride] = useState<View | null>(null);
  const view = viewOverride ?? (narrow ? "list" : "doll");

  const roleClass = roleClassOf(user, roleSlot);
  const filledCount = EQUIPMENT_SLOTS.filter(
    (slot) => equipmentBySlot[slot.key]?.item_name,
  ).length;

  const saveSlot = async (slotKey: string, values: SlotValues) => {
    try {
      const payload = buildEquipmentPayload(equipmentBySlot, slotKey, values);
      onChange(await saveUserEquipment(userId, roleSlot, payload));
      toast.success("Экипировка сохранена");
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить экипировку"));
    }
  };

  const renderSlot = (
    slot: EquipmentSlot,
    side: "left" | "right",
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
      compareItem={viewer.equipment?.find((item) => item.slot === slot.key)}
      onSave={(values) => saveSlot(slot.key, values)}
    />
  );

  return (
    <Card className="@container gap-0 py-0">
      <CardHeader className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-3 py-3 sm:px-4 [.border-b]:pb-3">
        <CardTitle className="min-w-0">
          <CharacterTabsSwitcher group="character" />
        </CardTitle>
        {canEdit && copySources.length > 0 && (
          <CopyEquipmentButton
            userId={userId}
            roleSlot={roleSlot}
            sources={copySources}
            onCopied={onChange}
          />
        )}
        {viewer.canCompare && (
          <CompareSwitch
            checked={viewer.isComparing}
            onCheckedChange={viewer.setComparing}
          />
        )}
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          {roleClass && <ClassBadge userClass={roleClass} />}
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
            roleSlot={roleSlot}
            equipment={equipment}
            seals={seals}
            user={user}
            canEdit={canEdit}
            level={level}
            onLevelChange={setLevel}
            buffs={buffs}
            guildBuffs={guildBuffs}
            skillBuild={skillBuild}
            viewer={viewer.stats}
            onBuffsChange={onBuffsChange}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-3 @[48rem]:order-first @[48rem]:col-span-2 @[60rem]:order-none @[60rem]:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold">Экипировка</span>
            <Segmented
              label="Вид экипировки"
              value={view}
              onChange={setViewOverride}
              options={VIEW_OPTIONS}
            />
          </div>

          {view === "list" && (
            <SlotList
              equipmentBySlot={equipmentBySlot}
              renderSlot={(slot) => renderSlot(slot, "right", false)}
            />
          )}
          {view === "doll" && (
            <CharacterDoll
              userId={userId}
              user={user}
              portraitUrl={portraitUrl}
              onPortraitChange={setPortraitUrl}
              canEdit={canEdit}
              renderSlot={renderSlot}
            />
          )}
        </div>

        <div className="min-w-0">
          <DetailedStatsPanel
            equipment={equipment}
            seals={seals}
            level={level}
            buffs={{ ...buffs, ...guildBuffs }}
            skillBuild={skillBuild}
            viewer={viewer.stats}
          />
        </div>
      </CardContent>
    </Card>
  );
}
