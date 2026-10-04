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

// Печать Эфе привязана к ячейке персонажа, а не к комплекту класса: уровень
// одинаковый во всех ролях, поэтому на слот берём предмет с наименьшей ролью.
export function epheEquipmentView(equipment: UserEquipment[]): UserEquipment[] {
  const bySlot = new Map<string, UserEquipment>();
  for (const item of [...equipment].sort((a, b) => a.role_slot - b.role_slot)) {
    if (!bySlot.has(item.slot)) bySlot.set(item.slot, item);
  }
  return [...bySlot.values()];
}
