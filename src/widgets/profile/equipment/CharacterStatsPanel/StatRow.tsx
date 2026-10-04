import { highlightNumbers } from "../highlightNumbers";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";

import StatDiff from "../StatDiff";
import { formatStatLine, type StatLine } from "./statSections";

type Props = {
  line: StatLine;
  viewerAmount?: number;
};

export default function StatRow({ line, viewerAmount }: Props) {
  const { label, tooltip } = line;
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
    <div className="flex items-start justify-between gap-2 text-xs">
      {labelNode}
      <span className="flex shrink-0 flex-col items-end">
        <span className="whitespace-nowrap font-medium tabular-nums">
          {formatStatLine(line)}
        </span>
        <StatDiff
          label={label}
          viewer={viewerAmount}
          owner={line.amount}
          decimals={line.decimals}
        />
      </span>
    </div>
  );
}
