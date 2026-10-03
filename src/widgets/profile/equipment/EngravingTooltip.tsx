import { type Engraving } from "./itemsData/engravings";
import {
  getSealGradeColor,
  getSealGradeLabel,
} from "@/widgets/profile/seals/sealsData";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";
import { EffectText } from "./highlightNumbers";
import { EngravingIcon } from "./EngravingIcon";

export function EngravingTooltip({
  engraving,
  side = "left",
  children,
}: {
  engraving: Engraving;
  side?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
}) {
  const color = getSealGradeColor(engraving.grade);
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        className="dark w-56 border-border bg-background p-3 text-foreground"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <EngravingIcon engraving={engraving} size={32} />
            <div className="min-w-0">
              <div className="text-xs" style={{ color: color ?? undefined }}>
                {getSealGradeLabel(engraving.grade)} предмет
              </div>
              <div
                className="truncate text-sm font-semibold"
                style={{ color: color ?? undefined }}
              >
                {engraving.name}
              </div>
            </div>
          </div>
          {engraving.effect && (
            <>
              <div className="border-t border-border" />
              <div className="space-y-0.5 text-xs text-muted-foreground">
                <EffectText text={engraving.effect} />
              </div>
            </>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
