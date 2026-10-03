import { highlightNumbers } from "../highlightNumbers";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";

import { BONUS_COLOR } from "../statColors";

export default function StatRow({
  label,
  value,
  boosted,
  tooltip,
}: {
  label: string;
  value: string;
  boosted: boolean;
  tooltip?: { title: string; lines: string[] };
}) {
  const labelNode = tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help whitespace-nowrap text-muted-foreground underline decoration-dotted underline-offset-2">
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="dark w-72 border-border bg-background p-3 text-foreground"
      >
        <div className="space-y-1">
          <div className="text-sm font-semibold">{tooltip.title}</div>
          <div className="space-y-0.5 text-xs text-muted-foreground">
            {tooltip.lines.map((line, i) => (
              <div key={i}>{highlightNumbers(line)}</div>
            ))}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  ) : (
    <span className="whitespace-nowrap text-muted-foreground">{label}</span>
  );

  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      {labelNode}
      <span
        className="whitespace-nowrap font-medium tabular-nums"
        style={{ color: boosted ? BONUS_COLOR : undefined }}
      >
        {value}
      </span>
    </div>
  );
}
