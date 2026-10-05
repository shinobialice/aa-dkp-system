import Image from "next/image";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";

import { BONUS_COLOR } from "../statColors";
import BuffTooltipCard from "./BuffTooltipCard";

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
            unoptimized
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
        <BuffTooltipCard icon={icon} title={title} description={description} />
      </TooltipContent>
    </Tooltip>
  );
}
