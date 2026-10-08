import type { ArchetypeSlot } from "@/actions/getUserArchetype";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import {
  EPHE_SLOT_TRACK,
  EPHE_TRACK_MAX_LEVEL,
} from "@/widgets/profile/ephe/epheSealsData";
import { lookupClassName } from "@/widgets/profile/archetype/classCombinations";
import { NO_SEAL, type SealSlot } from "@/widgets/profile/seals/SealSlotEditor";
import {
  DEFAULT_SEAL_LEVEL,
  MAX_USER_SEALS,
} from "@/widgets/profile/seals/sealsData";
import type { CalculatorBuild } from "../calculatorModel";

export type SkillsDraft = Pick<
  CalculatorBuild,
  "specializations" | "skillBuild"
>;

export function skillsDraftOf(build: CalculatorBuild): SkillsDraft {
  return {
    specializations: build.specializations,
    skillBuild: build.skillBuild,
  };
}

export function archetypeOf(specializations: (string | null)[]): ArchetypeSlot {
  return {
    specialization1: specializations[0] ?? null,
    specialization2: specializations[1] ?? null,
    specialization3: specializations[2] ?? null,
    className: lookupClassName(specializations),
  };
}

export function chosenSpecializations(
  specializations: (string | null)[],
): string[] {
  return specializations.filter((id): id is string => id !== null);
}

export function withSpecialization(
  draft: SkillsDraft,
  index: number,
  specializationId: string | null,
): SkillsDraft {
  const specializations = draft.specializations.map((current, position) =>
    position === index ? specializationId : current,
  );
  const skillBuild = Object.fromEntries(
    Object.entries(draft.skillBuild).filter(([id]) =>
      specializations.includes(id),
    ),
  );
  return { specializations, skillBuild };
}

export function sealSlotsOf(seals: UserSeal[]): SealSlot[] {
  return Array.from({ length: MAX_USER_SEALS }, (_, index) => ({
    name: seals[index]?.seal_name ?? null,
    level: seals[index]?.level ?? DEFAULT_SEAL_LEVEL,
  }));
}

export function sealsFromSlots(slots: SealSlot[]): UserSeal[] {
  return slots.flatMap((slot, index) => {
    if (!slot.name) return [];
    return [
      { id: index + 1, user_id: 0, seal_name: slot.name, level: slot.level },
    ];
  });
}

export function withSealName(
  slots: SealSlot[],
  index: number,
  name: string,
): SealSlot[] {
  return slots.map((slot, position) => {
    if (position !== index) return slot;
    if (name === NO_SEAL) return { name: null, level: DEFAULT_SEAL_LEVEL };
    return { name, level: slot.level };
  });
}

export function withSealLevel(
  slots: SealSlot[],
  index: number,
  level: number,
): SealSlot[] {
  return slots.map((slot, position) =>
    position === index ? { ...slot, level } : slot,
  );
}

export function takenSealNames(slots: SealSlot[], index: number): string[] {
  return slots.flatMap((slot, position) =>
    position !== index && slot.name ? [slot.name] : [],
  );
}

export function withEpheLevel(
  equipment: UserEquipment[],
  slot: string,
  level: number,
): UserEquipment[] {
  return equipment.map((item) =>
    item.slot === slot ? { ...item, ephe_seal_level: level } : item,
  );
}

export function withMaxEphe(equipment: UserEquipment[]): UserEquipment[] {
  return equipment.map((item) => {
    const track = EPHE_SLOT_TRACK[item.slot];
    if (!track) return item;
    return { ...item, ephe_seal_level: EPHE_TRACK_MAX_LEVEL[track] };
  });
}
