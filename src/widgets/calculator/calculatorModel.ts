import type {
  CalculatorPlayer,
  CalculatorRole,
} from "@/actions/getCalculatorPlayer";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import type { RoleSkillBuild } from "@/actions/getUserSkillBuild";
import type { EquipmentInput } from "@/actions/saveUserEquipment";
import { formatNumber } from "@/shared/lib/format";
import type { SelectedBuffs } from "@/widgets/profile/equipment/characterBuffs";

export type BuildOwner = {
  id: number;
  avatarUrl: string | null;
  portraitUrl: string | null;
};

export type CalculatorBuild = {
  name: string;
  roleClass: string | null;
  level: number;
  equipment: UserEquipment[];
  seals: UserSeal[];
  buffs: SelectedBuffs;
  specializations: (string | null)[];
  skillBuild: RoleSkillBuild;
  owner: BuildOwner | null;
};

export type TrackedBuild = {
  current: CalculatorBuild;
  original: CalculatorBuild;
  savedId: number | null;
};

const EMPTY_BUILD_NAME = "Новая кукла";
const ORIGINAL_BUILD_NAME = "Исходная версия";
const NO_SPECIALIZATIONS = [null, null, null];

export function emptyBuild(level: number): CalculatorBuild {
  return {
    name: EMPTY_BUILD_NAME,
    roleClass: null,
    level,
    equipment: [],
    seals: [],
    buffs: {},
    specializations: NO_SPECIALIZATIONS,
    skillBuild: {},
    owner: null,
  };
}

export function buildFromRole(
  player: CalculatorPlayer,
  role: CalculatorRole,
): CalculatorBuild {
  return {
    name: `${player.username} · ${role.label}`,
    roleClass: role.roleClass,
    level: player.level,
    equipment: role.equipment,
    seals: player.seals,
    buffs: role.buffs,
    specializations: role.specializations,
    skillBuild: role.skillBuild,
    owner: {
      id: player.id,
      avatarUrl: player.avatarUrl,
      portraitUrl: player.portraitUrl,
    },
  };
}

export function withEquipmentOf(
  base: CalculatorBuild,
  source: CalculatorBuild,
): CalculatorBuild {
  return {
    ...base,
    name: source.name,
    roleClass: source.roleClass,
    equipment: source.equipment,
    owner: source.owner,
  };
}

export function roleDetails(role: CalculatorRole): string {
  const parts = [
    role.roleClass !== role.label ? role.roleClass : null,
    role.gearScore !== null ? `ГС ${formatNumber(role.gearScore)}` : null,
  ];
  return parts.filter((part): part is string => part !== null).join(" · ");
}

export function originalOf(build: TrackedBuild): CalculatorBuild {
  return { ...build.original, name: ORIGINAL_BUILD_NAME };
}

export function trackBuild(
  build: CalculatorBuild,
  savedId: number | null = null,
): TrackedBuild {
  return { current: build, original: build, savedId };
}

export function selectedSkillCount(build: CalculatorBuild): number {
  return Object.values(build.skillBuild).reduce(
    (sum, specialization) => sum + specialization.selected.length,
    0,
  );
}

export function epheSlotCount(build: CalculatorBuild): number {
  return build.equipment.filter((item) => item.ephe_seal_level > 0).length;
}

export function filledSlotCount(build: CalculatorBuild): number {
  return build.equipment.filter((item) => item.item_name).length;
}

export function equipmentBySlot(
  equipment: UserEquipment[],
): Record<string, UserEquipment | undefined> {
  return Object.fromEntries(equipment.map((item) => [item.slot, item]));
}

export function equipmentFromInputs(items: EquipmentInput[]): UserEquipment[] {
  return items.flatMap((item, index) => {
    const itemName = item.itemName?.trim();
    if (!itemName) return [];
    return [
      {
        id: index + 1,
        user_id: 0,
        role_slot: 1,
        slot: item.slot,
        item_name: itemName,
        grade: item.grade,
        enchant: item.enchant,
        engravings: item.engravings,
        rune_id: item.runeId,
        synthesis_effects: item.synthesisEffects,
        synthesis_percent: item.synthesisPercent,
        ephe_seal_level: item.epheSealLevel,
      },
    ];
  });
}
