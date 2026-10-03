import Image from "next/image";
import { highlightNumbers } from "../highlightNumbers";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";

import { BONUS_COLOR } from "../statColors";

export default function BuffIcon({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="relative size-9 shrink-0 overflow-hidden rounded-md"
          style={{ boxShadow: `0 0 0 2px ${BONUS_COLOR}` }}
        >
          <Image
            src={icon}
            alt={title}
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="dark w-64 border-border bg-background p-3 text-foreground"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative size-8 shrink-0 overflow-hidden rounded-md">
              <Image
                src={icon}
                alt={title}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-2xs text-muted-foreground">Эффект</div>
              <div
                className="truncate text-sm font-semibold"
                style={{ color: BONUS_COLOR }}
              >
                {title}
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          <div className="space-y-0.5 text-xs text-muted-foreground">
            {description.split("\n").map((line, i) => (
              <div key={i}>{highlightNumbers(line)}</div>
            ))}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
