import * as v from "valibot";
import type { CharacterBuff, CharacterBuffOption } from "./itemsData/buffTypes";
import { GAME_BUFFS } from "./itemsData/gameBuffs";
import {
  addStat,
  signedEffectValue,
  STAT_EFFECTS,
  type StatBonuses,
} from "./itemsData/statEffects";

export type SelectedBuffs = Record<string, string>;

export type ActiveBuff = {
  buff: CharacterBuff;
  option: CharacterBuffOption;
};

export const CHARACTER_BUFFS = GAME_BUFFS;
export const PERSONAL_BUFFS = GAME_BUFFS.filter((buff) => !buff.guild);
export const GUILD_BUFFS = GAME_BUFFS.filter((buff) => buff.guild);

export const BUFF_OFF = "off";

const BUFF_ICON_DIR = "/images/equipment/";

const SELECTED_BUFFS_SCHEMA = v.record(v.string(), v.string());

export function parseSelectedBuffs(value: unknown): SelectedBuffs {
  const result = v.safeParse(SELECTED_BUFFS_SCHEMA, value);
  return result.success ? result.output : {};
}

export function isValidBuffSelection(
  value: unknown,
  allowed: CharacterBuff[],
): value is SelectedBuffs {
  if (!v.is(SELECTED_BUFFS_SCHEMA, value)) return false;
  return Object.entries(value).every(([buffId, optionValue]) => {
    const buff = allowed.find((candidate) => String(candidate.id) === buffId);
    return !!buff && !!findOption(buff, optionValue);
  });
}

export function pickBuffs(
  selected: SelectedBuffs,
  allowed: CharacterBuff[],
): SelectedBuffs {
  return Object.fromEntries(
    allowed.flatMap((buff) => {
      const value = selected[buff.id];
      return value === undefined ? [] : [[String(buff.id), value]];
    }),
  );
}

export function buffIconUrl(
  buff: CharacterBuff,
  option?: CharacterBuffOption,
): string {
  return BUFF_ICON_DIR + (option?.icon ?? buff.icon);
}

export function hasOptionIcons(buff: CharacterBuff): boolean {
  return buff.options.some((option) => option.icon !== undefined);
}

export function findBuff(buffId: number | string): CharacterBuff | undefined {
  return CHARACTER_BUFFS.find((buff) => String(buff.id) === String(buffId));
}

export function getActiveBuffs(selected: SelectedBuffs): ActiveBuff[] {
  return CHARACTER_BUFFS.flatMap((buff) => {
    const option = findOption(buff, selected[buff.id]);
    if (!option || !isRequirementMet(buff, selected)) return [];
    return [{ buff, option }];
  });
}

export function isRequirementMet(
  buff: CharacterBuff,
  selected: SelectedBuffs,
): boolean {
  return buff.requiresBuffId === undefined || !!selected[buff.requiresBuffId];
}

export function computeBuffStatBonuses(selected: SelectedBuffs): StatBonuses {
  const bonuses: StatBonuses = new Map();
  for (const { option } of getActiveBuffs(selected)) {
    for (const [code, value] of Object.entries(option.stats)) {
      const effect = STAT_EFFECTS[Number(code)];
      if (effect) {
        addStat(bonuses, effect.label, signedEffectValue(effect, value));
      }
    }
  }
  return bonuses;
}

export function findOption(
  buff: CharacterBuff,
  optionValue: string | undefined,
): CharacterBuffOption | undefined {
  return buff.options.find((option) => option.value === optionValue);
}
