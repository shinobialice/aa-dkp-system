"use client";

import { Check } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import {
  formatDate,
  type GiveawayStatus,
  type TrackedItem,
} from "./giveawayModel";

export const STATUS_STYLES = {
  Выдано: {
    dot: "bg-green-600",
    badge:
      "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
  },
  "В наличии": {
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  },
  Хочет: {
    dot: "bg-pink-500",
    badge: "bg-pink-100 text-pink-800 dark:bg-pink-500/15 dark:text-pink-300",
  },
} as const;

function tooltipText(name: string, status: GiveawayStatus, date: string) {
  if (status === "Выдано") {
    const shown = formatDate(date);
    return `${name} — выдано${shown ? ` ${shown}` : ""}`;
  }
  if (status === "В наличии") return `${name} — в наличии`;
  if (status === "Хочет") return `${name} — хочет`;
  return `${name} — не выдано`;
}

/** Иконка предмета со статусом: серая, если не выдано, и цветная точка
 * (зелёная с галочкой — выдано, синяя — в наличии, розовая — хочет). */
export function GiveawayStatusIcon({
  item,
  status,
  date,
  size = 26,
  tooltip = true,
}: {
  item: TrackedItem;
  status: GiveawayStatus;
  date: string;
  size?: number;
  tooltip?: boolean;
}) {
  const icon = (
    <span className="relative inline-flex shrink-0">
      <span
        className={cn(
          "inline-flex",
          status !== "Выдано" &&
            status !== "В наличии" &&
            "opacity-30 grayscale",
        )}
      >
        <LootIcon
          itemName={item.name}
          iconUrl={item.iconUrl}
          grade={item.grade}
          size={size}
        />
      </span>
      {status && (
        <span
          className={cn(
            "absolute -right-1 -bottom-1 grid size-3.5 place-items-center rounded-full border-2 border-card",
            STATUS_STYLES[status].dot,
          )}
        >
          {status === "Выдано" && (
            <Check className="size-2 text-white" strokeWidth={4} />
          )}
        </span>
      )}
    </span>
  );

  if (!tooltip) return icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{icon}</TooltipTrigger>
      <TooltipContent>{tooltipText(item.name, status, date)}</TooltipContent>
    </Tooltip>
  );
}
