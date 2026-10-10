import type { ProfileUser } from "@/actions/getUser";
import type { UserArchetype } from "@/actions/getUserArchetype";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { RoleSlot } from "@/shared/config/roleSlots";
import { hasRole, ROLE_SLOTS, roleTabLabel } from "../archetype/archetypeRoles";
import { equipmentForRole } from "../equipment/equipmentRoles";
import { isTwoHandedMainWeapon } from "../equipment/itemsData/weaponHandedness";
import { EPHE_SLOT_TRACK } from "./epheSealsData";

export type EpheRole = {
  roleSlot: RoleSlot;
  label: string;
};

export type EpheSlotUsage =
  | { role: EpheRole; status: "active"; item: UserEquipment }
  | { role: EpheRole; status: "two-handed" }
  | { role: EpheRole; status: "empty" };

export type EpheSlotCoverage = {
  active: number;
  total: number;
};

export function getEpheRoles(
  user: ProfileUser,
  archetype: UserArchetype,
): EpheRole[] {
  return ROLE_SLOTS.filter((slot) => hasRole(user, slot)).map((slot) => ({
    roleSlot: slot,
    label: roleTabLabel(user, slot, archetype[slot]),
  }));
}

// Печать Эфе качается на ячейку персонажа, но действует только там, где в
// ячейке есть предмет: с двуручным оружием печать левой руки не работает.
export function getEpheSlotUsage(
  equipment: UserEquipment[],
  roles: EpheRole[],
  slot: string,
): EpheSlotUsage[] {
  return roles.map((role) => {
    const roleEquipment = equipmentForRole(equipment, role.roleSlot);
    const item = roleEquipment.find((eq) => eq.slot === slot);
    if (item) return { role, status: "active", item };
    const mainHand = roleEquipment.find((eq) => eq.slot === "weapon_main");
    if (slot === "weapon_off" && isTwoHandedMainWeapon(mainHand?.item_name)) {
      return { role, status: "two-handed" };
    }
    return { role, status: "empty" };
  });
}

export function getEpheCoverage(
  equipment: UserEquipment[],
  roles: EpheRole[],
): Record<string, EpheSlotCoverage> {
  return Object.fromEntries(
    Object.keys(EPHE_SLOT_TRACK).map((slot) => {
      const usage = getEpheSlotUsage(equipment, roles, slot);
      const active = usage.filter((entry) => entry.status === "active").length;
      return [slot, { active, total: roles.length }];
    }),
  );
}

export function epheCoverageHint({ active, total }: EpheSlotCoverage): string {
  if (total === 1) {
    return active ? "Печать действует" : "Слот пуст — печать не действует";
  }
  return `Печать действует в ${active} из ${total} классов`;
}
