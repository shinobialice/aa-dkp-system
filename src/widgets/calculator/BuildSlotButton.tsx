import type { UserEquipment } from "@/actions/getUserEquipment";
import type { EquipmentSlot } from "@/widgets/profile/equipment/equipmentData";
import EquipmentSlotButton from "@/widgets/profile/equipment/EquipmentTab/EquipmentSlotButton";
import {
  buildEquipmentPayload,
  type SlotValues,
} from "@/widgets/profile/equipment/EquipmentTab/slotValues";
import {
  equipmentBySlot,
  equipmentFromInputs,
  type CalculatorBuild,
} from "./calculatorModel";

type Props = {
  slot: EquipmentSlot;
  build: CalculatorBuild;
  tooltipSide: "left" | "right";
  showRune: boolean;
  isChanged: boolean;
  onEquipmentChange: (equipment: UserEquipment[]) => void;
};

export default function BuildSlotButton({
  slot,
  build,
  tooltipSide,
  showRune,
  isChanged,
  onEquipmentChange,
}: Props) {
  const bySlot = equipmentBySlot(build.equipment);

  const handleSave = async (values: SlotValues) => {
    const payload = buildEquipmentPayload(bySlot, slot.key, values);
    onEquipmentChange(equipmentFromInputs(payload));
  };

  return (
    <div className="relative">
      <EquipmentSlotButton
        slot={slot}
        item={bySlot[slot.key]}
        equipment={build.equipment}
        canEdit
        tooltipSide={tooltipSide}
        showRune={showRune}
        onSave={handleSave}
      />
      {isChanged && (
        <span className="pointer-events-none absolute -top-1 -right-1 z-10 size-3 rounded-full border-2 border-background bg-amber-500" />
      )}
    </div>
  );
}
