import { useState, type ReactNode } from "react";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { Card, CardContent, CardHeader, Segmented } from "@/shared/ui";
import CharacterStatsPanel from "@/widgets/profile/equipment/CharacterStatsPanel";
import { DetailedStatsPanel } from "@/widgets/profile/equipment/DetailedStatsPanel";
import {
  CHARACTER_BUFFS,
  type SelectedBuffs,
} from "@/widgets/profile/equipment/characterBuffs";
import {
  EQUIPMENT_SLOTS,
  type EquipmentSlot,
} from "@/widgets/profile/equipment/equipmentData";
import SlotList from "@/widgets/profile/equipment/EquipmentTab/SlotList";
import { useNarrowScreen } from "@/widgets/profile/equipment/EquipmentTab/useNarrowScreen";
import BuildSlotButton from "../BuildSlotButton";
import { changedSlotKeys } from "../buildChanges";
import {
  equipmentBySlot,
  filledSlotCount,
  type CalculatorBuild,
  type TrackedBuild,
} from "../calculatorModel";
import BuildToolbar from "./BuildToolbar";
import CalculatorDoll from "./CalculatorDoll";

type Props = {
  doll: TrackedBuild;
  dollMenu: ReactNode;
  targetMenu: ReactNode;
  saveButton: ReactNode;
  onUpdate: (patch: Partial<CalculatorBuild>) => void;
  onReset: () => void;
  onCompareWithOriginal: () => void;
};

type View = "doll" | "list";

type RenderSlot = (
  slot: EquipmentSlot,
  side: "left" | "right",
  showRune?: boolean,
) => ReactNode;

const VIEW_OPTIONS = [
  { value: "doll" as const, label: "Кукла" },
  { value: "list" as const, label: "Списком" },
];

export default function SingleView({
  doll,
  dollMenu,
  targetMenu,
  saveButton,
  onUpdate,
  onReset,
  onCompareWithOriginal,
}: Props) {
  const build = doll.current;
  const changed = changedSlotKeys(doll);
  const filled = filledSlotCount(build);
  const narrow = useNarrowScreen();
  const [viewOverride, setViewOverride] = useState<View | null>(null);
  const view = viewOverride ?? (narrow ? "list" : "doll");

  const handleLevelChange = async (level: number) => onUpdate({ level });
  const handleBuffsSave = async (buffs: SelectedBuffs) => onUpdate({ buffs });
  const handleEquipmentChange = (equipment: UserEquipment[]) =>
    onUpdate({ equipment });

  const renderSlot: RenderSlot = (slot, side, showRune = true) => (
    <BuildSlotButton
      key={slot.key}
      slot={slot}
      build={build}
      tooltipSide={side}
      showRune={showRune}
      isChanged={changed.has(slot.key)}
      onEquipmentChange={handleEquipmentChange}
    />
  );

  return (
    <Card className="@container gap-0 py-0">
      <CardHeader className="border-b px-3 py-3 sm:px-4 [.border-b]:pb-3">
        <BuildToolbar
          doll={doll}
          dollMenu={dollMenu}
          targetMenu={targetMenu}
          saveButton={saveButton}
          onUpdate={onUpdate}
          onReset={onReset}
          onCompareWithOriginal={onCompareWithOriginal}
        />
      </CardHeader>
      <CardContent className="grid gap-4 p-3 sm:p-4 @[48rem]:grid-cols-2 @[60rem]:grid-cols-[280px_minmax(0,1fr)_300px] @[60rem]:items-start">
        <div className="flex min-w-0 flex-col">
          <CharacterStatsPanel
            equipment={build.equipment}
            seals={build.seals}
            user={{ username: build.name }}
            canEdit
            level={build.level}
            onLevelChange={handleLevelChange}
            buffs={build.buffs}
            guildBuffs={{}}
            buffChoices={CHARACTER_BUFFS}
            onBuffsSave={handleBuffsSave}
            skillBuild={build.skillBuild}
            viewer={null}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-3 @[48rem]:order-first @[48rem]:col-span-2 @[60rem]:order-none @[60rem]:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-baseline gap-2">
              <span className="font-semibold">Экипировка</span>
              <span className="text-sm text-muted-foreground">
                {filled} из {EQUIPMENT_SLOTS.length} ячеек
              </span>
            </span>
            <Segmented
              label="Вид экипировки"
              value={view}
              onChange={setViewOverride}
              options={VIEW_OPTIONS}
            />
          </div>
          {filled === 0 && (
            <p className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
              Нажмите на ячейку, чтобы надеть предмет, или возьмите готовую
              экипировку в меню «Кукла»
            </p>
          )}
          <EquipmentView view={view} build={build} renderSlot={renderSlot} />
          {changed.size > 0 && (
            <span className="inline-flex items-center gap-2 self-center text-xs text-muted-foreground">
              <span className="size-2.5 rounded-full bg-amber-500" />
              изменено по сравнению с исходной сборкой
            </span>
          )}
        </div>

        <div className="min-w-0">
          <DetailedStatsPanel
            equipment={build.equipment}
            seals={build.seals}
            level={build.level}
            buffs={build.buffs}
            skillBuild={build.skillBuild}
            viewer={null}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type EquipmentViewProps = {
  view: View;
  build: CalculatorBuild;
  renderSlot: RenderSlot;
};

function EquipmentView({ view, build, renderSlot }: EquipmentViewProps) {
  if (view === "list") {
    return (
      <SlotList
        equipmentBySlot={equipmentBySlot(build.equipment)}
        renderSlot={(slot) => renderSlot(slot, "right", false)}
      />
    );
  }
  return <CalculatorDoll build={build} renderSlot={renderSlot} />;
}
