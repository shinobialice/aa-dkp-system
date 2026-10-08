import type { UserEquipment } from "@/actions/getUserEquipment";
import { plural } from "@/shared/lib/format";
import type { SelectedBuffs } from "@/widgets/profile/equipment/characterBuffs";
import { EQUIPMENT_SLOTS } from "@/widgets/profile/equipment/equipmentData";
import {
  equipmentBySlot,
  type CalculatorBuild,
  type TrackedBuild,
} from "./calculatorModel";

export function isModified(build: TrackedBuild): boolean {
  return changedParts(build).length > 0;
}

export function changesText(build: TrackedBuild): string {
  return `изменено: ${changedParts(build).join(", ")}`;
}

export function changedSlotKeys(build: TrackedBuild): Set<string> {
  const current = equipmentBySlot(build.current.equipment);
  const original = equipmentBySlot(build.original.equipment);
  const changed = EQUIPMENT_SLOTS.filter(
    (slot) => !isSameItem(current[slot.key], original[slot.key]),
  );
  return new Set(changed.map((slot) => slot.key));
}

function changedParts(build: TrackedBuild): string[] {
  const { current, original } = build;
  const slotCount = changedSlotKeys(build).size;
  const parts: [isChanged: boolean, label: string][] = [
    [
      slotCount > 0,
      `${slotCount} ${plural(slotCount, "ячейка", "ячейки", "ячеек")}`,
    ],
    [current.level !== original.level, "уровень"],
    [current.roleClass !== original.roleClass, "класс"],
    [!isSameBuffs(current.buffs, original.buffs), "баффы"],
    [sealsKey(current) !== sealsKey(original), "печати"],
    [skillsKey(current) !== skillsKey(original), "умения"],
  ];
  return parts.filter(([isChanged]) => isChanged).map(([, label]) => label);
}

function isSameBuffs(a: SelectedBuffs, b: SelectedBuffs): boolean {
  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => a[key] === b[key])
  );
}

function sealsKey(build: CalculatorBuild): string {
  return build.seals.map((seal) => `${seal.seal_name}:${seal.level}`).join();
}

function skillsKey(build: CalculatorBuild): string {
  const specializations = Object.entries(build.skillBuild)
    .filter(([, specialization]) => specialization.selected.length > 0)
    .map(([id, specialization]) =>
      [
        id,
        [...specialization.selected].sort().join(),
        Object.entries(specialization.eferund).sort().join(),
      ].join(":"),
    )
    .sort();
  return [build.specializations.join(), ...specializations].join("|");
}

function isSameItem(
  a: UserEquipment | undefined,
  b: UserEquipment | undefined,
): boolean {
  if (!a || !b) return a === b;
  return (
    a.item_name === b.item_name &&
    a.grade === b.grade &&
    a.enchant === b.enchant &&
    a.rune_id === b.rune_id &&
    a.synthesis_percent === b.synthesis_percent &&
    a.ephe_seal_level === b.ephe_seal_level &&
    a.engravings.join() === b.engravings.join() &&
    a.synthesis_effects.join() === b.synthesis_effects.join()
  );
}
