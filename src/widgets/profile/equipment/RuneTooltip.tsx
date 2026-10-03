import { type Rune } from "./itemsData/runes";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { getEphenRuneSetForRune } from "./ephenRuneSetBonus";
import {
  getSealGradeColor,
  getSealGradeLabel,
} from "@/widgets/profile/seals/sealsData";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";
import { EffectText, highlightNumbers } from "./highlightNumbers";
import { RuneIcon } from "./RuneIcon";

function RuneSetTierRow({
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
      <div className="text-2xs font-semibold">[{count} шт.]</div>
      {text.split("\n").map((line, i) => (
        <div key={i} className="text-xs">
          {active ? highlightNumbers(line) : line}
        </div>
      ))}
    </div>
  );
}

export function RuneTooltip({
  rune,
  side = "left",
  equipment,
  children,
}: {
  rune: Rune;
  side?: "left" | "right" | "top" | "bottom";
  equipment?: UserEquipment[];
  children: React.ReactNode;
}) {
  const color = getSealGradeColor(rune.grade);
  const ephenSet = equipment
    ? getEphenRuneSetForRune(rune.id, equipment)
    : null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        className="dark pointer-events-none w-64 border-border bg-background p-3 text-foreground"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <RuneIcon rune={rune} size={32} />
            <div className="min-w-0">
              <div className="text-xs" style={{ color: color ?? undefined }}>
                {getSealGradeLabel(rune.grade)} предмет
              </div>
              <div
                className="truncate text-sm font-semibold"
                style={{ color: color ?? undefined }}
              >
                {rune.name}
              </div>
            </div>
          </div>
          {rune.effect && (
            <>
              <div className="border-t border-border" />
              <div className="space-y-0.5 text-xs text-muted-foreground">
                <EffectText text={rune.effect} />
              </div>
            </>
          )}
          {ephenSet && (
            <>
              <div className="border-t border-border" />
              <div className="space-y-1">
                <div className="text-xs font-semibold">
                  {ephenSet.name} ({ephenSet.count}/8)
                </div>
                <div className="space-y-1.5">
                  {ephenSet.tiers.map((tier) => (
                    <RuneSetTierRow
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
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
