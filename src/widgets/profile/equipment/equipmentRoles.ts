import type { UserEquipment } from "@/actions/getUserEquipment";
import type { RoleSlot } from "@/shared/config/roleSlots";

export type EquipmentCopySource = {
  roleSlot: RoleSlot;
  label: string;
};

export function equipmentForRole(
  equipment: UserEquipment[],
  roleSlot: RoleSlot,
): UserEquipment[] {
  return equipment.filter((item) => item.role_slot === roleSlot);
}
