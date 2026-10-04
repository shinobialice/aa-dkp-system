import { writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import * as prettier from "prettier";
import { ITEMS_DIR, readCatalog } from "./readCatalog.mjs";

const OUTPUT = `${ITEMS_DIR}/gameItemStats.ts`;

const PERCENT = 0.0099999998;
const BASE_GRADE_ID = 0;

// Патч после дампа: у латных доспехов 8 пунктов на единицу покрытия перенесли из защиты в сопротивление.
const PLATE_ARMOR_TYPE = 3;
const PLATE_RESIST_SHIFT_PER_COVERAGE = 8;

// Патч после дампа: защиту щитов снизили, коэффициент 0.27 → 0.15.
const SHIELD_FORMULA_RATIO = { old: "* 0.27", new: "* 0.15" };

const ATTRIBUTES = [
  ["str", "str_weight"],
  ["dex", "dex_weight"],
  ["sta", "sta_weight"],
  ["int", "int_weight"],
  ["spi", "spi_weight"],
];

const dumpPath = process.argv[2];
if (!dumpPath) {
  console.error("Usage: pnpm game:import <path to compact.sqlite3>");
  process.exit(1);
}

const db = new DatabaseSync(dumpPath, { readOnly: true });
const config = db.prepare("SELECT * FROM item_configs").get();
const baseGrade = db
  .prepare("SELECT * FROM item_grades WHERE id = ?")
  .get(BASE_GRADE_ID);
const wearableFormula = db
  .prepare("SELECT formula FROM wearable_formulas WHERE kind_id = 0")
  .get().formula;

const armorQuery = db.prepare(`
  SELECT i.level, a.type_id, a.mod_set_id, s.coverage, w.armor_bp, w.magic_resistance_bp
  FROM items i
  JOIN item_armors a ON a.item_id = i.id
  JOIN wearable_slots s ON s.slot_type_id = a.slot_type_id
  LEFT JOIN wearables w ON w.armor_type_id = a.type_id AND w.slot_type_id = a.slot_type_id
  WHERE i.id = ?
`);
const weaponQuery = db.prepare(`
  SELECT i.level, w.mod_set_id, h.stat_multiplier, h.formula_dps, h.formula_mdps,
         h.formula_hdps, h.formula_armor, h.formula_magic_resist
  FROM items i
  JOIN item_weapons w ON w.item_id = i.id
  JOIN holdables h ON h.id = w.holdable_id
  WHERE i.id = ?
`);
const attributeWeightsQuery = db.prepare(
  "SELECT * FROM equip_item_attr_modifiers WHERE id = ?",
);

const catalog = readCatalog();
const lines = [];
for (const [id, name] of catalog) {
  const stats = computeItemStats(id);
  if (!stats) continue;
  const entries = Object.entries(stats).filter(([, value]) => value !== 0);
  if (entries.length === 0) continue;
  const body = entries.map(([key, value]) => `${key}: ${value}`).join(", ");
  lines.push(`  ${id}: { ${body} }, // ${name}`);
}

const source = [
  "// Сгенерировано `pnpm game:import` из дампа клиента игры. Не редактировать вручную.",
  "export const GAME_ITEM_STATS: Record<number, Record<string, number>> = {",
  ...lines,
  "};",
].join("\n");
const prettierConfig = await prettier.resolveConfig(OUTPUT);
writeFileSync(
  OUTPUT,
  await prettier.format(source, { ...prettierConfig, filepath: OUTPUT }),
);
console.log(`${lines.length} items → ${OUTPUT}`);

function computeItemStats(id) {
  const armor = armorQuery.get(id);
  if (armor) return computeArmorStats(armor);
  const weapon = weaponQuery.get(id);
  if (weapon) return computeWeaponStats(weapon);
  return undefined;
}

function computeArmorStats(armor) {
  const stats = {};
  if (armor.armor_bp !== null) {
    let armorBp = armor.armor_bp;
    let resistBp = armor.magic_resistance_bp;
    if (armor.type_id === PLATE_ARMOR_TYPE) {
      armorBp -= PLATE_RESIST_SHIFT_PER_COVERAGE * armor.coverage;
      resistBp += PLATE_RESIST_SHIFT_PER_COVERAGE * armor.coverage;
    }
    const base = evaluateFormula(wearableFormula, {
      item_level: armor.level,
      item_grade: baseGrade.var_wearable_armor,
    });
    stats.wearable_armor = roundTo((base * armorBp) / 10000, 3);
    stats.wearable_magic_resistance = roundTo((base * resistBp) / 10000, 3);
  }
  const attributeScale =
    config.wearable_stat_const * PERCENT * armor.coverage * 0.01;
  for (const [key, value] of computeAttributes(armor, attributeScale)) {
    stats[key] = roundTo(value, 2);
  }
  return stats;
}

function computeWeaponStats(weapon) {
  const evaluate = (formula, grade) => {
    if (!formula || formula === "0") return 0;
    const patched = formula.replace(
      SHIELD_FORMULA_RATIO.old,
      SHIELD_FORMULA_RATIO.new,
    );
    return evaluateFormula(patched, {
      item_level: weapon.level,
      item_grade: grade,
    });
  };
  const stats = {
    weapon_dps: roundTo(
      evaluate(weapon.formula_dps, baseGrade.var_holdable_dps),
      1,
    ),
    weapon_magic_power: roundTo(
      evaluate(weapon.formula_mdps, baseGrade.var_holdable_magic_dps),
      1,
    ),
    weapon_heal_power: Math.round(
      evaluate(weapon.formula_hdps, baseGrade.var_holdable_magic_dps),
    ),
    wearable_armor: roundTo(
      evaluate(weapon.formula_armor, baseGrade.var_holdable_armor),
      2,
    ),
    wearable_magic_resistance: roundTo(
      evaluate(
        weapon.formula_magic_resist,
        baseGrade.var_holdable_magic_resist,
      ),
      2,
    ),
  };
  const attributeScale = config.holdable_stat_const * PERCENT;
  for (const [key, value] of computeAttributes(weapon, attributeScale)) {
    stats[key] = roundTo(value * weapon.stat_multiplier * 0.01 + 0.5, 2);
  }
  return stats;
}

function computeAttributes(item, kindScale) {
  if (!item.mod_set_id) return [];
  const row = attributeWeightsQuery.get(item.mod_set_id);
  const weights = ATTRIBUTES.map(([key, column]) => [key, row[column]]).filter(
    ([, weight]) => weight > 0,
  );
  const totalWeight = weights.reduce((sum, [, weight]) => sum + weight, 0);
  const count = weights.length;
  const concentration = count === 1 ? 3 : count === 2 ? 1.5 : 1;
  const concentrationScale = Math.pow(
    concentration,
    1 / (config.stat_value_const * PERCENT),
  );
  const budget =
    config.item_stat_const *
    PERCENT *
    item.level *
    concentrationScale *
    kindScale;
  return weights.map(([key, weight]) => [
    key,
    ((count * budget * weight) / totalWeight) *
      baseGrade.stat_multiplier *
      PERCENT,
  ]);
}

function evaluateFormula(formula, variables) {
  const expression = formula
    .replace(/\^/g, "**")
    .replace(/\b[a-z_]+\b/g, (word) =>
      word in variables ? `vars.${word}` : word,
    );
  const evaluate = new Function("vars", "floor", `return (${expression});`);
  return evaluate(variables, Math.floor);
}

function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
