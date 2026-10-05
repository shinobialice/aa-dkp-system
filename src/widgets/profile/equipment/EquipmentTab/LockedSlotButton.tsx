import Image from "next/image";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import type { EquipmentSlot } from "../equipmentData";

type Props = {
  slot: EquipmentSlot;
  tooltipSide: "left" | "right";
};

export default function LockedSlotButton({ slot, tooltipSide }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-label={`${slot.label}: занято двуручным оружием`}
          className="relative flex size-11 shrink-0 cursor-not-allowed items-center justify-center rounded-md"
        >
          <Image
            src={slot.iconUrl}
            alt={slot.label}
            fill
            sizes="44px"
            className="object-contain opacity-30 grayscale"
          />
          <Lock className="relative size-4 text-muted-foreground" />
        </span>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>
        Двуручное оружие занимает обе руки
      </TooltipContent>
    </Tooltip>
  );
}
