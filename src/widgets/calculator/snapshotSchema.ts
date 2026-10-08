import * as v from "valibot";
import { CLASS_ORDER } from "@/shared/config/classes";
import { EQUIPMENT_SLOTS } from "@/widgets/profile/equipment/equipmentData";
import { MAX_USER_SEALS } from "@/widgets/profile/seals/sealsData";

const SPECIALIZATION_COUNT = 3;

export const MAX_BUILD_NAME_LENGTH = 60;

const EQUIPMENT_ITEM_SCHEMA = v.object({
  slot: v.string(),
  itemName: v.nullable(v.string()),
  grade: v.number(),
  enchant: v.number(),
  engravings: v.array(v.number()),
  runeId: v.number(),
  synthesisEffects: v.array(v.number()),
  synthesisPercent: v.number(),
  epheSealLevel: v.number(),
});

export const BUILD_SNAPSHOT_SCHEMA = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1),
    v.maxLength(MAX_BUILD_NAME_LENGTH),
  ),
  roleClass: v.nullable(v.picklist(CLASS_ORDER)),
  level: v.number(),
  equipment: v.pipe(
    v.array(EQUIPMENT_ITEM_SCHEMA),
    v.maxLength(EQUIPMENT_SLOTS.length),
  ),
  seals: v.pipe(
    v.array(v.object({ sealName: v.string(), level: v.number() })),
    v.maxLength(MAX_USER_SEALS),
  ),
  buffs: v.record(v.string(), v.string()),
  specializations: v.pipe(
    v.array(v.nullable(v.string())),
    v.length(SPECIALIZATION_COUNT),
  ),
  skillBuild: v.pipe(
    v.record(
      v.string(),
      v.object({
        selected: v.array(v.string()),
        eferund: v.record(v.string(), v.string()),
      }),
    ),
    v.check((build) => Object.keys(build).length <= SPECIALIZATION_COUNT),
  ),
  ownerId: v.nullable(v.pipe(v.number(), v.integer())),
});

export const CALCULATOR_SNAPSHOT_SCHEMA = v.object({
  builds: v.union([
    v.strictTuple([BUILD_SNAPSHOT_SCHEMA]),
    v.strictTuple([BUILD_SNAPSHOT_SCHEMA, BUILD_SNAPSHOT_SCHEMA]),
  ]),
});

export const BUILD_OWNER_SCHEMA = v.object({
  id: v.number(),
  avatarUrl: v.nullable(v.string()),
  portraitUrl: v.nullable(v.string()),
});
