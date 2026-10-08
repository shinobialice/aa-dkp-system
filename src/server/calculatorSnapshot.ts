import "server-only";
import * as v from "valibot";
import type { SealInput } from "@/actions/saveUserSeals";
import type {
  BuildSnapshot,
  CalculatorSnapshot,
} from "@/widgets/calculator/buildSnapshot";
import {
  BUILD_SNAPSHOT_SCHEMA,
  CALCULATOR_SNAPSHOT_SCHEMA,
} from "@/widgets/calculator/snapshotSchema";
import { getSpecialization } from "@/widgets/profile/archetype/specializationsData";
import {
  CHARACTER_BUFFS,
  isValidBuffSelection,
} from "@/widgets/profile/equipment/characterBuffs";
import { isValidCharacterLevel } from "@/widgets/profile/equipment/characterLevel";
import {
  isValidSealLevel,
  isValidSealName,
} from "@/widgets/profile/seals/sealsData";
import {
  assertValidEquipmentItem,
  assertValidWeaponSet,
} from "./equipmentValidation";
import { cleanSkillBuild } from "./skillBuildValidation";

export function parseCalculatorSnapshot(value: unknown): CalculatorSnapshot {
  const result = v.safeParse(CALCULATOR_SNAPSHOT_SCHEMA, value);
  if (!result.success) throw new Error("Сборка повреждена или устарела");
  return result.output;
}

export function validateCalculatorSnapshot(value: unknown): CalculatorSnapshot {
  const [doll, target] = parseCalculatorSnapshot(value).builds;
  if (!target) return { builds: [validBuild(doll)] };
  return { builds: [validBuild(doll), validBuild(target)] };
}

export function parseBuildSnapshot(value: unknown): BuildSnapshot {
  const result = v.safeParse(BUILD_SNAPSHOT_SCHEMA, value);
  if (!result.success) throw new Error("Кукла повреждена или устарела");
  return result.output;
}

export function validateBuildSnapshot(value: unknown): BuildSnapshot {
  return validBuild(parseBuildSnapshot(value));
}

function validBuild(build: BuildSnapshot): BuildSnapshot {
  if (!isValidCharacterLevel(build.level)) {
    throw new Error(`Некорректный уровень персонажа: ${build.level}`);
  }
  const slots = new Set(build.equipment.map((item) => item.slot));
  if (slots.size !== build.equipment.length) {
    throw new Error("Слоты экипировки не должны повторяться");
  }
  build.equipment.forEach(assertValidEquipmentItem);
  assertValidWeaponSet(build.equipment);
  assertValidSeals(build.seals);
  if (!isValidBuffSelection(build.buffs, CHARACTER_BUFFS)) {
    throw new Error("Некорректный набор баффов");
  }
  assertValidSpecializations(build);
  return { ...build, skillBuild: cleanSkillBuild(build.skillBuild) };
}

function assertValidSeals(seals: SealInput[]) {
  const names = new Set(seals.map((seal) => seal.sealName));
  if (names.size !== seals.length) {
    throw new Error("Печати не должны повторяться");
  }
  for (const seal of seals) {
    if (!isValidSealName(seal.sealName) || !isValidSealLevel(seal.level)) {
      throw new Error(`Некорректная печать: ${seal.sealName}`);
    }
  }
}

function assertValidSpecializations(build: BuildSnapshot) {
  const chosen = build.specializations.filter(
    (id): id is string => id !== null,
  );
  if (new Set(chosen).size !== chosen.length) {
    throw new Error("Специализации не должны повторяться");
  }
  for (const id of chosen) {
    if (!getSpecialization(id)) {
      throw new Error(`Неизвестная специализация: ${id}`);
    }
  }
  for (const id of Object.keys(build.skillBuild)) {
    if (!chosen.includes(id)) {
      throw new Error("Умения выбраны в ветке, которой нет у сборки");
    }
  }
}
