import type { ReactNode } from "react";
import { X } from "lucide-react";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Button, Card } from "@/shared/ui";
import { LIST_GROUPS } from "@/widgets/profile/equipment/EquipmentTab/slotLayout";
import { computeTestGearScore } from "@/widgets/profile/equipment/gearScore";
import type { ProfileStats } from "@/widgets/profile/equipment/statComparison";
import BuildSlotButton from "../BuildSlotButton";
import { changedSlotKeys } from "../buildChanges";
import ChangesNote from "../ChangesNote";
import type { CalculatorBuild, TrackedBuild } from "../calculatorModel";
import BuildPortrait from "./BuildPortrait";
import BuildSettings from "./BuildSettings";
import { LETTER_CLASS, type BuildLetter } from "./compareStyles";

type Props = {
  letter: BuildLetter;
  caption: string;
  tracked: TrackedBuild;
  stats: ProfileStats;
  menu: ReactNode;
  saveButton: ReactNode;
  onUpdate: (patch: Partial<CalculatorBuild>) => void;
  onReset: () => void;
  onRemove?: () => void;
};

export default function BuildCard({
  letter,
  caption,
  tracked,
  stats,
  menu,
  saveButton,
  onUpdate,
  onReset,
  onRemove,
}: Props) {
  const build = tracked.current;
  const changed = changedSlotKeys(tracked);
  const gearScore = computeTestGearScore(build.equipment, build.seals);
  const portraitUrl = build.owner?.portraitUrl;
  const handleEquipmentChange = (equipment: UserEquipment[]) =>
    onUpdate({ equipment });

  return (
    <Card className="min-w-0 gap-4 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg text-base font-extrabold text-white",
            LETTER_CLASS[letter],
          )}
        >
          {letter}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
            {caption}
          </div>
          <div className="truncate font-bold">{build.name}</div>
        </div>
        {menu}
        {saveButton}
        {onRemove && (
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            aria-label="Убрать сравнение"
            title="Убрать сравнение"
            onClick={onRemove}
          >
            <X />
          </Button>
        )}
      </div>

      <BuildSettings build={build} onUpdate={onUpdate} />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {LIST_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                {group.title}
              </span>
              <div className="flex flex-wrap gap-x-2.5 gap-y-3">
                {group.slots.map((slot) => (
                  <BuildSlotButton
                    key={slot.key}
                    slot={slot}
                    build={build}
                    tooltipSide="right"
                    showRune={false}
                    isChanged={changed.has(slot.key)}
                    onEquipmentChange={handleEquipmentChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {portraitUrl && (
          <BuildPortrait name={build.name} portraitUrl={portraitUrl} />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-sm text-muted-foreground">
        <span>
          ГС <b className="text-foreground">{formatNumber(gearScore)}</b>
        </span>
        <span>
          Здоровье{" "}
          <b className="text-foreground">
            {formatNumber(stats.stats.health, 0)}
          </b>
        </span>
        <span>
          Мана{" "}
          <b className="text-foreground">{formatNumber(stats.stats.mana, 0)}</b>
        </span>
        <ChangesNote build={tracked} onReset={onReset} />
      </div>
    </Card>
  );
}
