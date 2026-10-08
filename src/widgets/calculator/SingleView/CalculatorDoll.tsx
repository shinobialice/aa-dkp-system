import type { ReactNode } from "react";
import type { EquipmentSlot } from "@/widgets/profile/equipment/equipmentData";
import PortraitPanel from "@/widgets/profile/equipment/EquipmentTab/PortraitPanel";
import {
  LEFT_SLOTS,
  RIGHT_SLOTS,
  TOP_SLOTS,
} from "@/widgets/profile/equipment/EquipmentTab/slotLayout";
import type { CalculatorBuild } from "../calculatorModel";

type Props = {
  build: CalculatorBuild;
  renderSlot: (slot: EquipmentSlot, side: "left" | "right") => ReactNode;
};

const NO_CLASS_PORTRAIT = "/images/equipment/portraits/no-class.webp";

export default function CalculatorDoll({ build, renderSlot }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex justify-center">
        {TOP_SLOTS.map((slot) => renderSlot(slot, "left"))}
      </div>

      <div className="flex w-full items-stretch justify-center gap-2 sm:gap-3">
        <div className="flex flex-col gap-4 pl-8">
          {LEFT_SLOTS.map((slot) => renderSlot(slot, "left"))}
        </div>

        <PortraitPanel
          name={build.name}
          avatarUrl={build.owner?.avatarUrl ?? null}
          roleClass={build.roleClass}
          portraitUrl={build.owner?.portraitUrl ?? null}
          upload={null}
          fallbackPortrait={NO_CLASS_PORTRAIT}
          className="max-w-70 min-w-40 flex-1"
        />

        <div className="flex flex-col gap-4 pr-8">
          {RIGHT_SLOTS.map((slot) => renderSlot(slot, "right"))}
        </div>
      </div>
    </div>
  );
}
