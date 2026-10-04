import { readFileSync, writeFileSync } from "node:fs";
import * as prettier from "prettier";
import { ITEMS_DIR, readCatalog } from "./readCatalog.mjs";

const SYNTHESIS_OUTPUT = `${ITEMS_DIR}/gameSynthesis.ts`;
const SET_BONUSES_OUTPUT = `${ITEMS_DIR}/gameSetBonuses.ts`;
const BUFFS_OUTPUT = `${ITEMS_DIR}/gameBuffs.ts`;
const HEADER =
  "// Сгенерировано `pnpm game:tables` из данных игры. Не редактировать вручную.";

// unit_attribute игры → [код эффекта из statEffects.ts, множитель].
const UNIT_ATTRIBUTES = {
  0: [8, 1],
  1: [10, 1],
  2: [12, 1],
  3: [9, 1],
  4: [11, 1],
  6: [0, 1],
  7: [1, 1],
  8: [6, 1],
  64: [7, 1],
  33: [2, 0.001],
  34: [3, 0.001],
  35: [4, 0.001],
  87: [4, 0.001],
  173: [5, 0.001],
  175: [5, 0.001],
  10: [13, 0.1],
  71: [14, 0.1],
  218: [15, 1],
  77: [17, 0.1],
  17: [18, 0.1],
  121: [19, 0.1],
  51: [20, 0.1],
  196: [21, 0.1],
  244: [22, 0.1],
  82: [24, 0.1],
  26: [25, 0.1],
  122: [26, 0.1],
  52: [27, 0.1],
  197: [28, 0.1],
  245: [29, 0.1],
  86: [31, 0.1],
  31: [32, 0.1],
  123: [33, 0.1],
  53: [34, 0.1],
  198: [35, 0.1],
  246: [36, 0.1],
  181: [37, 1],
  204: [38, 0.1],
  57: [39, 1],
  184: [40, 1],
  81: [41, 0.1],
  179: [42, 0.1],
  180: [43, 0.1],
  183: [44, 1],
  182: [46, 1],
  149: [48, 0.1],
  199: [50, 0.1],
  143: [51, 0.1],
  142: [53, -1],
  200: [54, -1],
  145: [55, 0.1],
  144: [57, -1],
  201: [58, -1],
  147: [59, 0.1],
  146: [61, -1],
  202: [62, -1],
  185: [63, 0.1],
  176: [64, 0.1],
  120: [65, 0.1],
  252: [68, 0.1],
  56: [73, 0.1],
  89: [80, 0.1],
  58: [81, 0.1],
  94: [76, 1],
  291: [45, 1],
  290: [47, 1],
  293: [52, 0.1],
  294: [56, 0.1],
  295: [60, 0.1],
  255: [66, 0.1],
  222: [67, 0.1],
  67: [82, 0.2],
  68: [83, 0.2],
};

const MAX_GRADE = 12;
const SYNTHESIS_START_PERCENT = 0;
const SYNTHESIS_FULL_PERCENT = 100;
const PVE_SET_NAME = /_PVE$/i;

// Сноровка в игре — четыре одинаковых модификатора скорости, сводим их в один.
const PROFICIENCY_PARTS = [54, 55, 74, 119];
const PROFICIENCY = 218;
const FLAT_MODIFIER = 0;

// Ключи баффов в effects.json → код эффекта из statEffects.ts.
const BUFF_STAT_CODES = {
  hp: 0,
  mp: 1,
  atkMelee: 2,
  atkRanged: 3,
  atkSpell: 4,
  atkHeal: 5,
  armor: 6,
  mres: 7,
  str: 8,
  int: 9,
  dex: 10,
  spi: 11,
  sta: 12,
  speedPct: 13,
  cast: 14,
  dexterity: 15,
  critM: 17,
  backM: 19,
  skillM: 20,
  skillPveM: 21,
  skillPvpM: 22,
  critR: 24,
  backR: 26,
  skillR: 27,
  skillPveR: 28,
  skillPvpR: 29,
  critS: 31,
  backS: 33,
  skillS: 34,
  skillPveS: 35,
  skillPvpS: 36,
  tactics: 37,
  pierce: 39,
  ignoreRes: 40,
  critRes: 44,
  critResPen: 45,
  pvpRes: 46,
  pvpResPen: 47,
  vulnSiege: 48,
  vulnPve: 50,
  vulnM: 51,
  resPenM: 52,
  vulnR: 55,
  resPenR: 56,
  vulnS: 59,
  resPenS: 60,
  critHeal: 63,
  skillHeal: 65,
  healingAdditional: 66,
  healingDamage: 67,
  healingDamagePve: 68,
  receivedHealing: 73,
  healthRegenCombat: 82,
  manaRegenCombat: 83,
};
// Поправки по подсказкам баффов и окну характеристик в игре (2026-10): у статуи
// бонус к урону идёт в урон исцеляющими умениями, а не в умения целителя, и не
// снижает осадный урон; гильдейский PvE-бафф действует и на исцеляющие умения;
// у «Благословения предела» восстановление в бою +50 / +10. Титула «Истребитель
// драконов» в effects.json нет — он взят из дампа игры (бафф 8000780), «Ключевой
// фигуры» тоже нет — она взята из подсказки в игре.
const BUFF_OVERRIDES = {
  23: {
    extraOptions: [
      {
        value: "19",
        label: "Истребитель драконов",
        icon: "titles/icon_item_6016.png",
        text: [
          "Все основные характеристики +30",
          "Шанс критического удара и исцеления +3%",
          "Доп. урон умений +4%",
          "Устойчивость к критическому урону +500 ед.",
          "Пробивание брони и игнорирование сопротивления +500 ед.",
          "Игнорирование устойчивости к атакам в PvP +50 ед.",
          "Игнорирование устойчивости к критическому урону +100 ед.",
        ].join("\n"),
        flat: {
          str: 30,
          dex: 30,
          sta: 30,
          int: 30,
          spi: 30,
          critM: 3,
          critR: 3,
          critS: 3,
          critHeal: 3,
          skillM: 4,
          skillR: 4,
          skillS: 4,
          skillHeal: 4,
          critRes: 500,
          pierce: 500,
          ignoreRes: 500,
          pvpResPen: 50,
          critResPen: 100,
        },
      },
      {
        value: "20",
        label: "Ключевая фигура",
        icon: "titles/icon_skill_buff235.png",
        text: "Устойчивость к атакам в PvP +400 ед.",
        flat: { pvpRes: 400 },
      },
    ],
  },
  0: {
    dropStats: ["vulnSiege"],
    renameStats: { skillHeal: "healingDamage" },
    optionIcons: { 2: "buffs/effects/30765.png" },
  },
  17: { copyStats: { skillPveM: "healingDamagePve" } },
  9: {
    stats: { healthRegenCombat: 50, manaRegenCombat: 10 },
    text: [
      [
        "Восстановление здоровья в бою +250",
        "Восстановление здоровья в бою +50",
      ],
      ["Восстановление маны в бою +50", "Восстановление маны в бою +10"],
    ],
  },
};
const BUFF_ICON_PREFIX = "icons/reference/images/";
const BUFF_TEXT_HEADER_LINES = 2;
const GUILD_BUFF_CATEGORY = "Гильдия";
// Нумены ремесленника и ученика не влияют на боевые характеристики.
const HIDDEN_BUFF_IDS = new Set(["15", "16"]);
const TITLE_ICON_PATH = BUFF_ICON_PREFIX + "titles/";

const dataDir = process.argv[2];
if (!dataDir) {
  console.error(
    "Usage: pnpm game:tables <folder with growth.json and client-data.json>",
  );
  process.exit(1);
}

const growth = readJson("growth.json");
const clientData = readJson("client-data.json");
const effects = readJson("effects.json");
const catalog = readCatalog();

await writeSynthesis();
await writeSetBonuses();
await writeBuffs();

async function writeSynthesis() {
  const profileByItemId = new Map();
  for (const [slotAndId, profileIndex] of Object.entries(growth.items)) {
    const itemId = Number(slotAndId.split("|")[1]);
    if (!profileByItemId.has(itemId)) {
      profileByItemId.set(itemId, growth.profiles[profileIndex]);
    }
  }

  const poolNames = new Map();
  const poolName = (pool) => {
    const body = `{ ${Object.entries(pool)
      .map(([code, value]) => `${code}: ${value}`)
      .join(", ")} }`;
    if (!poolNames.has(body)) poolNames.set(body, `POOL_${poolNames.size + 1}`);
    return poolNames.get(body);
  };
  const levelsSource = (levels) =>
    Object.entries(levels)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(
        ([percent, slots]) =>
          `[${percent}, [${slots.map(poolName).join(", ")}]]`,
      )
      .join(", ");

  const synthesisTables = buildSynthesisTables();
  const profileByCategory = new Map();
  for (const [itemId, profile] of profileByItemId) {
    const category = clientData.records[itemId]?.category;
    if (category && !profileByCategory.has(category)) {
      profileByCategory.set(category, profile);
    }
  }

  const itemLines = [];
  for (const [itemId, name] of catalog) {
    const category = clientData.records[itemId]?.category;
    const growthProfile =
      profileByItemId.get(itemId) ?? profileByCategory.get(category);
    const profile = growthProfile
      ? withPveSlots(synthesisTables, category, growthProfile)
      : tableProfile(synthesisTables, category);
    if (!profile) continue;
    const gradeLines = Object.entries(profile)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([grade, levels]) => `${grade}: [${levelsSource(levels)}]`);
    itemLines.push(`  ${itemId}: { ${gradeLines.join(", ")} }, // ${name}`);
  }

  await writeSource(SYNTHESIS_OUTPUT, [
    HEADER,
    'import type { ItemSynthesis } from "./synthesisTypes";',
    "",
    ...[...poolNames].map(([pool, name]) => `const ${name} = ${pool};`),
    "",
    "export const GAME_ITEM_SYNTHESIS: Record<number, ItemSynthesis> = {",
    ...itemLines,
    "};",
  ]);
  console.log(
    `${itemLines.length} items, ${poolNames.size} effect pools → ${SYNTHESIS_OUTPUT}`,
  );
}

async function writeSetBonuses() {
  const setLevels = new Map();
  for (const [itemId] of catalog) {
    const record = clientData.records[itemId];
    if (!record?.setId) continue;
    const level = setLevels.get(record.setId) ?? Infinity;
    setLevels.set(record.setId, Math.min(level, record.level));
  }

  const setLines = [];
  for (const [setId, level] of [...setLevels].sort(([a], [b]) => a - b)) {
    const set = clientData.equipmentSets[setId];
    if (!set) continue;
    const stepLines = set.steps.flatMap((step) => {
      const stats = stepStats(step.modifiers, level);
      if (stats.length === 0) return [];
      const body = stats.map(([code, value]) => `${code}: ${value}`).join(", ");
      return [`${step.pieces}: { ${body} }`];
    });
    if (stepLines.length === 0) continue;
    setLines.push(`  ${setId}: { ${stepLines.join(", ")} }, // ${set.name}`);
  }

  await writeSource(SET_BONUSES_OUTPUT, [
    HEADER,
    "export const GAME_SET_BONUSES: Record<",
    "  number,",
    "  Record<number, Record<number, number>>",
    "> = {",
    ...setLines,
    "};",
  ]);
  console.log(`${setLines.length} sets → ${SET_BONUSES_OUTPUT}`);
}

async function writeBuffs() {
  const unknownKeys = new Set();
  const visibleBuffs = effects.filter(
    (buff) => !HIDDEN_BUFF_IDS.has(String(buff.id)),
  );
  const buffs = visibleBuffs.map((buff) => {
    const requires = Object.keys(buff.options[0].requires ?? {});
    const buffIcon = buff.icon.replace(BUFF_ICON_PREFIX, "");
    const override = BUFF_OVERRIDES[buff.id] ?? {};
    const category = buff.options[0].description.split("\n")[1];
    return {
      id: Number(buff.id),
      name: buff.name,
      icon: buffIcon,
      ...(category === GUILD_BUFF_CATEGORY && { guild: true }),
      ...(requires.length > 0 && { requiresBuffId: Number(requires[0]) }),
      options: buff.options.map((option) => {
        const icon =
          override.optionIcons?.[option.value] ??
          option.icon?.replace(BUFF_ICON_PREFIX, "");
        const lines = option.description
          .split("\n")
          .slice(BUFF_TEXT_HEADER_LINES);
        return {
          value: option.value,
          label: option.label,
          ...(icon && icon !== buffIcon && { icon }),
          text: patchText(
            [...lines, ...titleExtraLines(buff, option)].join("\n"),
            override.text ?? [],
          ),
          stats: buffStats(option, override, unknownKeys),
        };
      }),
    };
  });
  for (const buff of buffs) {
    const extraOptions = BUFF_OVERRIDES[buff.id]?.extraOptions ?? [];
    for (const { flat, ...option } of extraOptions) {
      buff.options.push({
        ...option,
        stats: buffStats({ primary: {}, flat }, {}, unknownKeys),
      });
    }
  }

  await writeSource(BUFFS_OUTPUT, [
    HEADER,
    'import type { CharacterBuff } from "./buffTypes";',
    "",
    `export const GAME_BUFFS: CharacterBuff[] = ${JSON.stringify(buffs)};`,
  ]);
  console.log(`${buffs.length} buffs → ${BUFFS_OUTPUT}`);
  if (unknownKeys.size > 0) {
    console.warn(`Unknown buff stat keys: ${[...unknownKeys].join(", ")}`);
  }
}

// В effects.json у старших званий нет строк про крит и доп. урон, хотя числа есть.
function titleExtraLines(buff, option) {
  if (!buff.icon.startsWith(TITLE_ICON_PATH)) return [];
  const { critM, critRes, skillM, pierce } = option.flat;
  if (critM) {
    return [
      `Шанс критического удара и исцеления +${critM}%`,
      `Устойчивость к критическому урону +${critRes} ед.`,
    ];
  }
  if (skillM) {
    return [
      `Доп. урон и эффективность умений +${skillM}%`,
      `Пробивание брони и игнорирование сопротивления +${pierce} ед.`,
    ];
  }
  return [];
}

function patchText(text, replacements) {
  return replacements.reduce(
    (result, [from, to]) => result.replace(from, to),
    text,
  );
}

function buffStats(option, override, unknownKeys) {
  const stats = {};
  for (const [key, value] of Object.entries({
    ...option.primary,
    ...option.flat,
    ...override.stats,
  })) {
    if (override.dropStats?.includes(key)) continue;
    const targets = [override.renameStats?.[key] ?? key];
    if (override.copyStats?.[key]) targets.push(override.copyStats[key]);
    for (const target of targets) {
      const code = BUFF_STAT_CODES[target];
      if (code === undefined) unknownKeys.add(target);
      else stats[code] = value;
    }
  }
  return stats;
}

// Для предметов без growth.json синтез считается прямо по игровым
// таблицам item_rnd_attr_*: 0% опыта — минимум диапазона, 100% — максимум.
function buildSynthesisTables() {
  const groupBy = (rows, key) => {
    const map = new Map();
    for (const row of rows) {
      if (!map.has(row[key])) map.set(row[key], []);
      map.get(row[key]).push(row);
    }
    return map;
  };
  const { sets, groups, values, properties } = clientData.synthesis;
  return {
    sets: groupBy(
      [...sets].sort((a, b) => a.id - b.id),
      "item_rnd_attr_category_id",
    ),
    groups: groupBy(groups, "item_rnd_attr_unit_modifier_group_set_id"),
    values: new Map(
      values.map((row) => [`${row.group_id}:${row.grade_id}`, row]),
    ),
    properties: new Map(
      properties.map((row) => [
        `${row.item_rnd_attr_category_id}:${row.grade_id}`,
        row,
      ]),
    ),
  };
}

function tableProfile(tables, category) {
  if (!category) return undefined;
  const profile = {};
  for (let quality = 1; quality <= MAX_GRADE; quality++) {
    const slots = tableSlots(tables, category, quality);
    if (slots.length === 0) continue;
    profile[quality] = {
      [SYNTHESIS_START_PERCENT]: slots.map((slot) => slot.min),
      [SYNTHESIS_FULL_PERCENT]: slots.map((slot) => slot.max),
    };
  }
  return Object.keys(profile).length > 0 ? profile : undefined;
}

function tableSlots(tables, category, quality) {
  const gradeId = clientData.grades[quality]?.id;
  const property = tables.properties.get(`${category}:${gradeId}`);
  if (gradeId === undefined || !property) return [];
  const slots = [];
  for (const set of tables.sets.get(category) ?? []) {
    const min = {};
    const max = {};
    for (const group of tables.groups.get(set.id) ?? []) {
      const range = tables.values.get(`${group.id}:${gradeId}`);
      const mapping = UNIT_ATTRIBUTES[group.unit_attribute_id];
      if (!range || !mapping || group.unit_modifier_type_id !== FLAT_MODIFIER) {
        continue;
      }
      const [code, scale] = mapping;
      min[code] = roundScaled(range.min, scale);
      max[code] = roundScaled(range.max, scale);
    }
    if (Object.keys(max).length === 0) continue;
    const isPve = PVE_SET_NAME.test(set.name);
    for (let pick = 0; pick < set.pick_num; pick++) {
      slots.push({ min, max, isPve });
    }
  }
  return slots.slice(0, property.max_unit_modifier_num);
}

// В growth.json нет PvE-слота (устойчивость к атакам монстров),
// который игровые таблицы дают, например, проклятым доспехам на 12 грейде.
function withPveSlots(tables, category, profile) {
  if (!category) return profile;
  const result = {};
  for (const [grade, levels] of Object.entries(profile)) {
    const slotCount = Object.values(levels)[0].length;
    const missing = tableSlots(tables, category, Number(grade))
      .slice(slotCount)
      .filter((slot) => slot.isPve);
    result[grade] = Object.fromEntries(
      Object.entries(levels).map(([percent, slots]) => [
        percent,
        [
          ...slots,
          ...missing.map((slot) => interpolatePool(slot, Number(percent))),
        ],
      ]),
    );
  }
  return result;
}

function interpolatePool({ min, max }, percent) {
  return Object.fromEntries(
    Object.keys(max).map((code) => [
      code,
      roundTo(min[code] + ((max[code] - min[code]) * percent) / 100, 2),
    ]),
  );
}

function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function roundScaled(value, scale) {
  return Math.round(Math.trunc(value) * scale * 1e6) / 1e6;
}

function stepStats(modifiers, level) {
  const flat = modifiers.filter(
    ([, type, , , extra]) => type === FLAT_MODIFIER && !extra,
  );
  const proficiency = flat.filter(([id]) => PROFICIENCY_PARTS.includes(id));
  const normalized =
    proficiency.length === PROFICIENCY_PARTS.length
      ? [
          ...flat.filter(([id]) => !PROFICIENCY_PARTS.includes(id)),
          [PROFICIENCY, ...proficiency[0].slice(1)],
        ]
      : flat;

  const totals = new Map();
  for (const [attributeId, , base, perLevel] of normalized) {
    const mapping = UNIT_ATTRIBUTES[attributeId];
    if (!mapping) continue;
    const [code, scale] = mapping;
    const value = Math.round(base + (perLevel * level) / 100) * scale;
    totals.set(code, Math.round(((totals.get(code) ?? 0) + value) * 100) / 100);
  }
  return [...totals];
}

async function writeSource(output, lines) {
  const prettierConfig = await prettier.resolveConfig(output);
  writeFileSync(
    output,
    await prettier.format(lines.join("\n"), {
      ...prettierConfig,
      filepath: output,
    }),
  );
}

function readJson(file) {
  return JSON.parse(readFileSync(`${dataDir}/${file}`, "utf8"));
}
