import type * as v from "valibot";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { EquipmentInput } from "@/actions/saveUserEquipment";
import { EQUIPMENT_SLOTS } from "@/widgets/profile/equipment/equipmentData";
import {
  equipmentFromInputs,
  type BuildOwner,
  type CalculatorBuild,
} from "./calculatorModel";
import type {
  BUILD_SNAPSHOT_SCHEMA,
  CALCULATOR_SNAPSHOT_SCHEMA,
} from "./snapshotSchema";

export type BuildSnapshot = v.InferOutput<typeof BUILD_SNAPSHOT_SCHEMA>;

export type CalculatorSnapshot = v.InferOutput<
  typeof CALCULATOR_SNAPSHOT_SCHEMA
>;

const SHARE_LINK_PATTERN = /^(?:.*\/calc\/)?([A-Za-z0-9]{8})\/?(?:[?#].*)?$/;

export function snapshotOf(
  doll: CalculatorBuild,
  target: CalculatorBuild | null,
): CalculatorSnapshot {
  if (!target) return { builds: [toSnapshot(doll)] };
  return { builds: [toSnapshot(doll), toSnapshot(target)] };
}

export function toSnapshot(build: CalculatorBuild): BuildSnapshot {
  return {
    name: build.name,
    roleClass: build.roleClass,
    level: build.level,
    equipment: build.equipment.map(toEquipmentInput),
    seals: build.seals.map((seal) => ({
      sealName: seal.seal_name,
      level: seal.level,
    })),
    buffs: build.buffs,
    specializations: build.specializations,
    skillBuild: build.skillBuild,
    ownerId: build.owner?.id ?? null,
  };
}

export function fromSnapshot(
  snapshot: BuildSnapshot,
  owners: BuildOwner[],
): CalculatorBuild {
  return {
    name: snapshot.name,
    roleClass: snapshot.roleClass,
    level: snapshot.level,
    equipment: equipmentFromInputs(snapshot.equipment),
    seals: snapshot.seals.map((seal, index) => ({
      id: index + 1,
      user_id: 0,
      seal_name: seal.sealName,
      level: seal.level,
    })),
    buffs: snapshot.buffs,
    specializations: snapshot.specializations,
    skillBuild: snapshot.skillBuild,
    owner: owners.find((owner) => owner.id === snapshot.ownerId) ?? null,
  };
}

export function shareIdFromLink(link: string): string | null {
  return SHARE_LINK_PATTERN.exec(link.trim())?.[1] ?? null;
}

export function snapshotDetails(snapshot: BuildSnapshot): string {
  const parts = [
    snapshot.roleClass,
    `ур. ${snapshot.level}`,
    `${snapshot.equipment.length} из ${EQUIPMENT_SLOTS.length} ячеек`,
  ];
  return parts.filter((part): part is string => part !== null).join(" · ");
}

export function ownersOf(builds: CalculatorBuild[]): BuildOwner[] {
  const owners = new Map<number, BuildOwner>();
  for (const build of builds) {
    if (build.owner) owners.set(build.owner.id, build.owner);
  }
  return [...owners.values()];
}

function toEquipmentInput(item: UserEquipment): EquipmentInput {
  return {
    slot: item.slot,
    itemName: item.item_name,
    grade: item.grade,
    enchant: item.enchant,
    engravings: item.engravings,
    runeId: item.rune_id,
    synthesisEffects: item.synthesis_effects,
    synthesisPercent: item.synthesis_percent,
    epheSealLevel: item.ephe_seal_level,
  };
}
