import {
  EPHEN_SYNTHESIS_CATEGORIES,
  type EphenSynthesisCategoryKey,
  type EphenSynthesisCategory,
} from "./ephenSynthesisData";

const ITEM_CATEGORY: Record<number, EphenSynthesisCategoryKey> = {
  54995: "head",
  55002: "head",
  55009: "head",
  54996: "chest",
  55003: "chest",
  55010: "chest",
  54997: "legs",
  55004: "legs",
  55011: "legs",
  54998: "hands",
  55005: "hands",
  55012: "hands",
  54999: "feet",
  55006: "feet",
  55013: "feet",
  55000: "bracers",
  55007: "bracers",
  55014: "bracers",
  55001: "belt",
  55008: "belt",
  55015: "belt",
  55016: "weapon_1h",
  55017: "weapon_1h",
  55019: "weapon_1h",
  55021: "weapon_1h",
  55023: "weapon_1h",
  55025: "weapon_1h",
  55027: "weapon_1h",
  55030: "weapon_1h",
  55018: "weapon_2h",
  55020: "weapon_2h",
  55022: "weapon_2h",
  55024: "weapon_2h",
  55026: "weapon_2h",
  55028: "weapon_2h",
  55029: "weapon_bow",
  55037: "weapon_bow",
  55031: "instrument",
  55032: "instrument",

  // base
  54953: "head_base",
  54954: "chest_base",
  54955: "legs_base",
  54956: "hands_base",
  54957: "feet_base",
  54958: "bracers_base",
  54959: "belt_base",
  54960: "head_base",
  54961: "chest_base",
  54962: "legs_base",
  54963: "hands_base",
  54964: "feet_base",
  54965: "bracers_base",
  54966: "belt_base",
  54967: "head_base",
  54968: "chest_base",
  54969: "legs_base",
  54970: "hands_base",
  54971: "feet_base",
  54972: "bracers_base",
  54973: "belt_base",
  54974: "weapon_1h_base",
  54975: "weapon_1h_base",
  54977: "weapon_1h_base",
  54979: "weapon_1h_base",
  54981: "weapon_1h_base",
  54983: "weapon_1h_base",
  54985: "weapon_1h_base",
  54976: "weapon_2h_base",
  54978: "weapon_2h_base",
  54980: "weapon_2h_base",
  54982: "weapon_2h_base",
  54984: "weapon_2h_base",
  54986: "weapon_2h_base",
  54987: "weapon_bow_base",
  54994: "weapon_bow_base",
  54988: "weapon_1h_base",
  54989: "instrument_base",
  54990: "instrument_base",

  // brilliant (Изначальное)
  55038: "head_brilliant",
  55039: "chest_brilliant",
  55040: "legs_brilliant",
  55041: "hands_brilliant",
  55042: "feet_brilliant",
  55043: "bracers_brilliant",
  55044: "belt_brilliant",
  55045: "head_brilliant",
  55046: "chest_brilliant",
  55047: "legs_brilliant",
  55048: "hands_brilliant",
  55049: "feet_brilliant",
  55050: "bracers_brilliant",
  55051: "belt_brilliant",
  55052: "head_brilliant",
  55053: "chest_brilliant",
  55054: "legs_brilliant",
  55055: "hands_brilliant",
  55056: "feet_brilliant",
  55057: "bracers_brilliant",
  55058: "belt_brilliant",
  55059: "weapon_1h_brilliant",
  55060: "weapon_1h_brilliant",
  55062: "weapon_1h_brilliant",
  55064: "weapon_1h_brilliant",
  55066: "weapon_1h_brilliant",
  55068: "weapon_1h_brilliant",
  55070: "weapon_1h_brilliant",
  55061: "weapon_2h_brilliant",
  55063: "weapon_2h_brilliant",
  55065: "weapon_2h_brilliant",
  55067: "weapon_2h_brilliant",
  55069: "weapon_2h_brilliant",
  55071: "weapon_2h_brilliant",
  55072: "weapon_bow_brilliant",
  55079: "weapon_bow_brilliant",
  55073: "weapon_1h_brilliant",
  55074: "instrument_brilliant",
  55075: "instrument_brilliant",

  // refined (Обновленное)
  55080: "head_refined",
  55081: "chest_refined",
  55082: "legs_refined",
  55083: "hands_refined",
  55084: "feet_refined",
  55085: "bracers_refined",
  55086: "belt_refined",
  55087: "head_refined",
  55088: "chest_refined",
  55089: "legs_refined",
  55090: "hands_refined",
  55091: "feet_refined",
  55092: "bracers_refined",
  55093: "belt_refined",
  55094: "head_refined",
  55095: "chest_refined",
  55096: "legs_refined",
  55097: "hands_refined",
  55098: "feet_refined",
  55099: "bracers_refined",
  55100: "belt_refined",
  55101: "weapon_1h_refined",
  55102: "weapon_1h_refined",
  55104: "weapon_1h_refined",
  55106: "weapon_1h_refined",
  55108: "weapon_1h_refined",
  55110: "weapon_1h_refined",
  55112: "weapon_1h_refined",
  55103: "weapon_2h_refined",
  55105: "weapon_2h_refined",
  55107: "weapon_2h_refined",
  55109: "weapon_2h_refined",
  55111: "weapon_2h_refined",
  55113: "weapon_2h_refined",
  55114: "weapon_bow_refined",
  55121: "weapon_bow_refined",
  55115: "weapon_1h_refined",
  55116: "instrument_refined",
  55117: "instrument_refined",

  55078: "earring_brilliant",

  920012: "dracordis_omniconsuming",
};

export function getEphenSynthesisCategory(
  itemId: number,
): EphenSynthesisCategory | undefined {
  const key = ITEM_CATEGORY[itemId];
  if (!key) return undefined;
  return EPHEN_SYNTHESIS_CATEGORIES[key];
}

export function isEphenSynthesisEligible(itemId: number): boolean {
  return itemId in ITEM_CATEGORY;
}

export function getEphenSynthesisMinGrade(itemId: number): number {
  return getEphenSynthesisCategory(itemId)?.minGrade ?? 10;
}

export function interpolateSynthesisValue(
  range: [number, number],
  percent: number,
  isPercent: boolean,
): number {
  const [min, max] = range;
  const raw = min + ((max - min) * percent) / 100;
  return isPercent ? Math.round(raw * 10) / 10 : Math.round(raw);
}

const ATTRIBUTE_KEYS = new Set(["str", "dex", "sta", "int", "spi"]);

export function isValidEphenSynthesisSelection(
  itemId: number,
  grade: number,
  percent: number,
  primary: string,
  secondary: string,
  tertiary: string[],
): boolean {
  if (percent === 0 && !primary && !secondary && tertiary.length === 0) {
    return true;
  }
  const category = getEphenSynthesisCategory(itemId);
  if (!category) return false;
  if (grade < category.minGrade) return false;
  if (!Number.isInteger(percent) || percent < 0 || percent > 100) return false;

  // Уникальное легендарное оружие: 2 независимых пула вместо пары
  // "1-я/2-я характеристика" + доп. — pool А (может быть >1 выбора)
  // хранится в tertiary, pool Б (1 выбор) — в secondary, primary не используется.
  if (category.groups.length === 2) {
    const [poolA, poolB] = category.groups;
    if (primary) return false;
    if (secondary && !poolB.options.some((o) => o.key === secondary)) return false;
    if (tertiary.length > poolA.pickCount) return false;
    if (new Set(tertiary).size !== tertiary.length) return false;
    if (!tertiary.every((key) => poolA.options.some((o) => o.key === key))) return false;
    return true;
  }

  const tertiaryGroup = category.groups[2];
  if (primary && !ATTRIBUTE_KEYS.has(primary)) return false;
  if (secondary && !ATTRIBUTE_KEYS.has(secondary)) return false;
  if (primary && secondary && primary === secondary) return false;
  if (tertiary.length > (tertiaryGroup?.pickCount ?? 0)) return false;
  if (new Set(tertiary).size !== tertiary.length) return false;
  if (!tertiary.every((key) => tertiaryGroup?.options.some((o) => o.key === key))) {
    return false;
  }
  return true;
}
