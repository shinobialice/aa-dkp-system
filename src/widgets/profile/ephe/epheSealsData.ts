export type EpheTrackKey =
  | "weapon_melee"
  | "weapon_ranged"
  | "armor_defense"
  | "armor_resist"
  | "jewelry_pvp"
  | "jewelry_crit";

export const EPHE_SLOT_TRACK: Record<string, EpheTrackKey> = {
  weapon_main: "weapon_melee",
  weapon_off: "weapon_melee",
  weapon_ranged: "weapon_ranged",
  head: "armor_defense",
  chest: "armor_defense",
  legs: "armor_defense",
  hands: "armor_resist",
  feet: "armor_resist",
  belt: "armor_resist",
  bracers: "armor_resist",
  necklace: "jewelry_pvp",
  earring1: "jewelry_pvp",
  earring2: "jewelry_pvp",
  ring1: "jewelry_crit",
  ring2: "jewelry_crit",
  instrument: "jewelry_crit",
};

export const EPHE_TRACK_LABELS: Record<EpheTrackKey, string> = {
  weapon_melee: "Оружие (ближний бой)",
  weapon_ranged: "Оружие дальнего боя",
  armor_defense: "Броня — Защита",
  armor_resist: "Броня — Сопротивление",
  jewelry_pvp: "Украшения — Устойчивость к PvP",
  jewelry_crit: "Украшения/инструмент — Устойчивость к крит. урону",
};

export const EPHE_TRACK_MAX_LEVEL: Record<EpheTrackKey, number> = {
  weapon_melee: 66,
  weapon_ranged: 66,
  armor_defense: 66,
  armor_resist: 66,
  jewelry_pvp: 14,
  jewelry_crit: 14,
};

export const EPHE_TRACK_MILESTONE_STAT: Record<EpheTrackKey, string> = {
  weapon_melee: "Здоровье",
  weapon_ranged: "Мана",
  armor_defense: "Защита",
  armor_resist: "Сопротивление",
  jewelry_pvp: "Устойчивость к атакам в PvP",
  jewelry_crit: "Устойчивость к критическому урону",
};

export const EPHE_TRACK_PERCENT_CATEGORY: Record<
  EpheTrackKey,
  "weapon" | "armor" | null
> = {
  weapon_melee: "weapon",
  weapon_ranged: "weapon",
  armor_defense: "armor",
  armor_resist: "armor",
  jewelry_pvp: null,
  jewelry_crit: null,
};

export const EPHE_GRADE_LABELS = [
  "Обычный",
  "Необычный",
  "Редкий",
  "Уникальный",
  "Эпический",
  "Легендарный",
  "Реликвия",
  "Эпоха Чудес",
  "Эпоха Сказаний",
  "Эпоха Легенд",
  "Эпоха Мифов",
  "Эпоха Двенадцати",
];

export type EpheLevelRow =
  | { level: number; grade: number; type: "improvement" }
  | {
      level: number;
      grade: number;
      type: "milestone";
      stat: string;
      value: number;
    };

const GRADE_RANGES_66: [number, number][] = [
  [1, 3],
  [4, 6],
  [7, 10],
  [11, 14],
  [15, 18],
  [19, 24],
  [25, 30],
  [31, 36],
  [37, 42],
  [43, 48],
  [49, 56],
  [57, 66],
];

const MILESTONE_LEVELS_66 = new Set([
  3, 6, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44,
  46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66,
]);

function gradeIndexForLevel(ranges: [number, number][], level: number): number {
  return ranges.findIndex(([start, end]) => level >= start && level <= end);
}

function standardMagnitude(level: number): number {
  if (level <= 14) return 10;
  if (level <= 36) return 15;
  if (level <= 56) return 20;
  return 25;
}

function resistMagnitude(level: number): number {
  if (level === 66) return 25;
  if (level <= 14) return 7;
  if (level <= 36) return 10;
  if (level <= 56) return 15;
  return 20;
}

const track66Cache = new Map<EpheTrackKey, EpheLevelRow[]>();

function build66Track(track: EpheTrackKey): EpheLevelRow[] {
  const cached = track66Cache.get(track);
  if (cached) return cached;
  const stat = EPHE_TRACK_MILESTONE_STAT[track];
  const magnitudeFn =
    track === "armor_resist" ? resistMagnitude : standardMagnitude;
  const rows: EpheLevelRow[] = [];
  for (let level = 1; level <= 66; level++) {
    const grade = gradeIndexForLevel(GRADE_RANGES_66, level);
    rows.push(
      MILESTONE_LEVELS_66.has(level)
        ? { level, grade, type: "milestone", stat, value: magnitudeFn(level) }
        : { level, grade, type: "improvement" },
    );
  }
  track66Cache.set(track, rows);
  return rows;
}

const GRADE_RANGES_14: [number, number][] = [
  [1, 3],
  [4, 6],
  [7, 10],
  [11, 14],
];

const JEWELRY_PVP_VALUES: Record<number, number> = {
  1: 10,
  2: 10,
  3: 15,
  4: 10,
  5: 10,
  6: 20,
  7: 10,
  8: 10,
  9: 10,
  10: 20,
  11: 10,
  12: 10,
  13: 10,
  14: 20,
};
const JEWELRY_CRIT_VALUES: Record<number, number> = {
  1: 5,
  2: 5,
  3: 7,
  4: 5,
  5: 5,
  6: 10,
  7: 5,
  8: 5,
  9: 5,
  10: 10,
  11: 5,
  12: 5,
  13: 5,
  14: 15,
};

const track14Cache = new Map<EpheTrackKey, EpheLevelRow[]>();

function build14Track(track: EpheTrackKey): EpheLevelRow[] {
  const cached = track14Cache.get(track);
  if (cached) return cached;
  const stat = EPHE_TRACK_MILESTONE_STAT[track];
  const values =
    track === "jewelry_pvp" ? JEWELRY_PVP_VALUES : JEWELRY_CRIT_VALUES;
  const rows: EpheLevelRow[] = [];
  for (let level = 1; level <= 14; level++) {
    const grade = gradeIndexForLevel(GRADE_RANGES_14, level);
    rows.push({ level, grade, type: "milestone", stat, value: values[level] });
  }
  track14Cache.set(track, rows);
  return rows;
}

export function getEpheTrackLevels(track: EpheTrackKey): EpheLevelRow[] {
  return EPHE_TRACK_MAX_LEVEL[track] === 66
    ? build66Track(track)
    : build14Track(track);
}

export function isValidEpheSealLevel(slot: string, level: number): boolean {
  const track = EPHE_SLOT_TRACK[slot];
  if (!track) return level === 0;
  return (
    Number.isInteger(level) &&
    level >= 0 &&
    level <= EPHE_TRACK_MAX_LEVEL[track]
  );
}

export function getEpheEffectiveness(
  track: EpheTrackKey,
  chosenLevel: number,
): number {
  if (EPHE_TRACK_PERCENT_CATEGORY[track] === null) return 0;
  let count = 0;
  for (const row of getEpheTrackLevels(track)) {
    if (row.level > chosenLevel) break;
    if (row.type === "improvement") count++;
  }
  return Math.round(count * 10) / 100;
}

export type EpheItemTier = "default" | "ephen" | "ramian";

const WEAPON_PERCENT_CURVE: Record<EpheItemTier, [number, number][]> = {
  default: [
    [0.2, 0.65],
    [0.4, 1.3],
    [0.7, 2.28],
    [0.9, 2.93],
    [1.1, 3.59],
    [1.4, 4.56],
    [1.7, 5.54],
    [2.0, 6.52],
    [2.3, 7.5],
    [2.6, 8.51],
    [3.0, 9.78],
  ],
  ephen: [
    [0.2, 0.66],
    [0.4, 1.32],
    [0.7, 2.3],
    [0.9, 2.96],
    [1.1, 3.62],
    [1.4, 4.6],
    [1.7, 5.59],
    [2.0, 6.58],
    [2.3, 7.53],
    [2.6, 8.55],
    [3.0, 9.86],
  ],
  ramian: [
    [0.2, 0.66],
    [0.4, 1.32],
    [0.7, 2.31],
    [0.9, 2.97],
    [1.1, 3.63],
    [1.4, 4.62],
    [1.7, 5.61],
    [2.0, 6.6],
    [2.3, 7.59],
    [2.6, 8.58],
    [3.0, 9.9],
  ],
};

const ARMOR_PERCENT_CURVE: Record<EpheItemTier, [number, number][]> = {
  default: [
    [0.2, 0.29],
    [0.4, 0.59],
    [0.7, 1.03],
    [0.9, 1.32],
    [1.1, 1.62],
    [1.4, 2.06],
    [1.7, 2.5],
    [2.0, 2.94],
    [2.3, 3.38],
    [2.6, 3.82],
    [3.0, 4.41],
  ],
  ephen: [
    [0.2, 0.3],
    [0.4, 0.59],
    [0.7, 1.03],
    [0.9, 1.33],
    [1.1, 1.63],
    [1.4, 2.07],
    [1.7, 2.51],
    [2.0, 2.96],
    [2.3, 3.4],
    [2.6, 3.84],
    [3.0, 4.43],
  ],
  ramian: [
    [0.2, 0.3],
    [0.4, 0.6],
    [0.7, 1.04],
    [0.9, 1.34],
    [1.1, 1.64],
    [1.4, 2.09],
    [1.7, 2.54],
    [2.0, 2.98],
    [2.3, 3.43],
    [2.6, 3.88],
    [3.0, 4.47],
  ],
};

function evalPercentCurve(points: [number, number][], x: number): number {
  const full: [number, number][] = [[0, 0], ...points];
  if (x <= full[0][0]) return full[0][1];
  const last = full.length - 1;
  if (x >= full[last][0]) {
    const [x0, y0] = full[last - 1];
    const [x1, y1] = full[last];
    const slope = (y1 - y0) / (x1 - x0);
    return y1 + (x - x1) * slope;
  }
  for (let i = 0; i < last; i++) {
    const [x0, y0] = full[i];
    const [x1, y1] = full[i + 1];
    if (x >= x0 && x <= x1) {
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return full[last][1];
}

export function getEphePercentBonus(
  category: "weapon" | "armor",
  tier: EpheItemTier,
  effectiveness: number,
): number {
  const curve = (
    category === "weapon" ? WEAPON_PERCENT_CURVE : ARMOR_PERCENT_CURVE
  )[tier];
  return evalPercentCurve(curve, effectiveness);
}
