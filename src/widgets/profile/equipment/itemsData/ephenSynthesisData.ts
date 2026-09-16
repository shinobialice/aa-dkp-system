type BaseSlotKey =
  | "head"
  | "chest"
  | "legs"
  | "hands"
  | "feet"
  | "bracers"
  | "belt"
  | "weapon_1h"
  | "weapon_2h"
  | "weapon_bow"
  | "instrument"
  | "earring";

// Уникальное легендарное оружие — синтез устроен иначе, чем у обычной брони
// и оружия (нет пары "1-я/2-я характеристика", вместо этого 2 независимых
// пула с собственным числом выборов каждый).
type LegendaryWeaponKey = "dracordis_omniconsuming";

export type EphenSynthesisCategoryKey =
  | BaseSlotKey
  | `${BaseSlotKey}_base`
  | `${BaseSlotKey}_brilliant`
  | `${BaseSlotKey}_refined`
  | LegendaryWeaponKey;

export type EphenSynthesisOption = {
  key: string;
  label: string;
  isPercent: boolean;
  ranges: Partial<Record<10 | 11 | 12, [number, number]>>;
};

export type EphenSynthesisGroup = {
  pickCount: number;
  options: EphenSynthesisOption[];
};

export type EphenSynthesisCategory = {
  id: number;
  minGrade: 10 | 11 | 12;
  groups: EphenSynthesisGroup[];
};

export const EPHEN_SYNTHESIS_CATEGORIES: Partial<Record<EphenSynthesisCategoryKey, EphenSynthesisCategory>> = {
  weapon_1h: {
    id: 594,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "attack_speed_mul", label: "Сноровка", isPercent: false, ranges: { 10: [40, 43], 11: [47, 50], 12: [54, 57] } },
          { key: "casting_time_mul", label: "Время применения умений", isPercent: true, ranges: { 10: [-2.8, -3], 11: [-3.1, -3.3], 12: [-3.4, -3.6] } },
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 10: [5.3, 5.4], 11: [5.6, 5.7], 12: [5.9, 6] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 10: [5.3, 5.4], 11: [5.6, 5.7], 12: [5.9, 6] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 10: [5.3, 5.4], 11: [5.6, 5.7], 12: [5.9, 6] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 10: [5.3, 5.4], 11: [5.6, 5.7], 12: [5.9, 6] } },
          { key: "melee_critical_bonus", label: "Критический урон в ближнем бою", isPercent: true, ranges: { 10: [15.1, 15.5], 11: [15.9, 16.2], 12: [16.6, 17] } },
          { key: "ranged_critical_bonus", label: "Критический урон в дальнем бою", isPercent: true, ranges: { 10: [15.1, 15.5], 11: [15.9, 16.2], 12: [16.6, 17] } },
          { key: "spell_critical_bonus", label: "Критический урон заклинаний", isPercent: true, ranges: { 10: [15.1, 15.5], 11: [15.9, 16.2], 12: [16.6, 17] } },
          { key: "heal_critical_bonus", label: "Критический эффект исцеления", isPercent: true, ranges: { 10: [15.1, 15.5], 11: [15.9, 16.2], 12: [16.6, 17] } },
          { key: "ignore_armor", label: "Пробивание брони", isPercent: false, ranges: { 10: [604, 619], 11: [634, 650], 12: [665, 680] } },
          { key: "magic_penetration", label: "Игнорирование сопротивления", isPercent: false, ranges: { 10: [604, 619], 11: [634, 650], 12: [665, 680] } },
        ],
      },
    ],
  },
  weapon_2h: {
    id: 595,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [199, 212], 11: [216, 228], 12: [232, 241] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [199, 212], 11: [216, 228], 12: [232, 241] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [199, 212], 11: [216, 228], 12: [232, 241] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [199, 212], 11: [216, 228], 12: [232, 241] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [199, 212], 11: [216, 228], 12: [232, 241] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [37, 39], 11: [39, 43], 12: [43, 45] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [37, 39], 11: [39, 43], 12: [43, 45] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [37, 39], 11: [39, 43], 12: [43, 45] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [37, 39], 11: [39, 43], 12: [43, 45] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [37, 39], 11: [39, 43], 12: [43, 45] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "attack_speed_mul", label: "Сноровка", isPercent: false, ranges: { 10: [72, 77], 11: [84, 90], 12: [97, 102] } },
          { key: "casting_time_mul", label: "Время применения умений", isPercent: true, ranges: { 10: [-5.1, -5.4], 11: [-5.6, -6], 12: [-6.2, -6.5] } },
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 10: [9.5, 9.7], 11: [10, 10.2], 12: [10.6, 10.8] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 10: [9.5, 9.7], 11: [10, 10.2], 12: [10.6, 10.8] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 10: [9.5, 9.7], 11: [10, 10.2], 12: [10.6, 10.8] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 10: [9.5, 9.7], 11: [10, 10.2], 12: [10.6, 10.8] } },
          { key: "melee_critical_bonus", label: "Критический урон в ближнем бою", isPercent: true, ranges: { 10: [27.1, 27.9], 11: [28.6, 29.1], 12: [29.8, 30.6] } },
          { key: "ranged_critical_bonus", label: "Критический урон в дальнем бою", isPercent: true, ranges: { 10: [27.1, 27.9], 11: [28.6, 29.1], 12: [29.8, 30.6] } },
          { key: "spell_critical_bonus", label: "Критический урон заклинаний", isPercent: true, ranges: { 10: [27.1, 27.9], 11: [28.6, 29.1], 12: [29.8, 30.6] } },
          { key: "heal_critical_bonus", label: "Критический эффект исцеления", isPercent: true, ranges: { 10: [27.1, 27.9], 11: [28.6, 29.1], 12: [29.8, 30.6] } },
          { key: "ignore_armor", label: "Пробивание брони", isPercent: false, ranges: { 10: [1087, 1114], 11: [1141, 1170], 12: [1197, 1224] } },
          { key: "magic_penetration", label: "Игнорирование сопротивления", isPercent: false, ranges: { 10: [1087, 1114], 11: [1141, 1170], 12: [1197, 1224] } },
        ],
      },
    ],
  },
  weapon_bow: {
    id: 596,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "ignore_armor", label: "Пробивание брони", isPercent: false, ranges: { 10: [518, 530], 11: [543, 555], 12: [568, 580] } },
          { key: "magic_penetration", label: "Игнорирование сопротивления", isPercent: false, ranges: { 10: [518, 530], 11: [543, 555], 12: [568, 580] } },
          { key: "persistent_health_regen", label: "Восстановление здоровья в бою", isPercent: false, ranges: { 10: [4, 5], 11: [5, 6], 12: [6, 6] } },
          { key: "persistent_mana_regen", label: "Восстановление маны в бою", isPercent: false, ranges: { 10: [4, 5], 11: [5, 6], 12: [6, 6] } },
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 10: [4.7, 4.8], 11: [4.9, 5.1], 12: [5.2, 5.3] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 10: [4.7, 4.8], 11: [4.9, 5.1], 12: [5.2, 5.3] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 10: [4.7, 4.8], 11: [4.9, 5.1], 12: [5.2, 5.3] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 10: [4.7, 4.8], 11: [4.9, 5.1], 12: [5.2, 5.3] } },
          { key: "melee_critical_bonus", label: "Критический урон в ближнем бою", isPercent: true, ranges: { 10: [13.2, 13.5], 11: [13.9, 14.2], 12: [14.6, 14.9] } },
          { key: "ranged_critical_bonus", label: "Критический урон в дальнем бою", isPercent: true, ranges: { 10: [13.2, 13.5], 11: [13.9, 14.2], 12: [14.6, 14.9] } },
          { key: "spell_critical_bonus", label: "Критический урон заклинаний", isPercent: true, ranges: { 10: [13.2, 13.5], 11: [13.9, 14.2], 12: [14.6, 14.9] } },
          { key: "heal_critical_bonus", label: "Критический эффект исцеления", isPercent: true, ranges: { 10: [13.2, 13.5], 11: [13.9, 14.2], 12: [14.6, 14.9] } },
        ],
      },
    ],
  },
  instrument: {
    id: 598,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "melee_dps_inc", label: "Сила атаки в ближнем бою", isPercent: false, ranges: { 10: [18.9, 19.4], 11: [19.8, 20.3], 12: [20.7, 21.2] } },
          { key: "ranged_dps_inc", label: "Сила атаки в дальнем бою", isPercent: false, ranges: { 10: [18.9, 19.4], 11: [19.8, 20.3], 12: [20.7, 21.2] } },
          { key: "spell_dps_inc", label: "Сила заклинаний", isPercent: false, ranges: { 10: [18.9, 19.4], 11: [19.8, 20.3], 12: [20.7, 21.2] } },
          { key: "heal_dps_inc", label: "Эффективность исцеления", isPercent: false, ranges: { 10: [18.9, 19.4], 11: [19.8, 20.3], 12: [20.7, 21.2] } },
          { key: "block_mul", label: "Блокирование", isPercent: true, ranges: { 10: [3, 3.1], 11: [3.1, 3.2], 12: [3.2, 3.3] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 10: [2, 2.1], 11: [2.1, 2.2], 12: [2.2, 2.3] } },
          { key: "move_speed_mul", label: "Скорость передвижения", isPercent: true, ranges: { 10: [2.5, 2.6], 11: [2.6, 2.7], 12: [2.8, 2.9] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 10: [4, 4.1], 11: [4.2, 4.3], 12: [4.4, 4.5] } },
        ],
      },
    ],
  },
  head: {
    id: 599,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [148, 160], 11: [162, 172], 12: [175, 181] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [148, 160], 11: [162, 172], 12: [175, 181] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [148, 160], 11: [162, 172], 12: [175, 181] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [148, 160], 11: [162, 172], 12: [175, 181] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [148, 160], 11: [162, 172], 12: [175, 181] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [27, 29], 11: [29, 31], 12: [32, 33] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [27, 29], 11: [29, 31], 12: [32, 33] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [27, 29], 11: [29, 31], 12: [32, 33] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [27, 29], 11: [29, 31], 12: [32, 33] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [27, 29], 11: [29, 31], 12: [32, 33] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [378, 387], 11: [397, 406], 12: [416, 425] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [378, 387], 11: [397, 406], 12: [416, 425] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [3.5, 3.6], 11: [3.7, 3.8], 12: [3.9, 4] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 10: [2.6, 2.7], 11: [2.7, 2.8], 12: [2.8, 2.9] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 10: [393, 403], 11: [413, 422], 12: [432, 442] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 10: [-1.9, -1.9], 11: [-2, -2], 12: [-2, -2.1] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 10: [-1.9, -1.9], 11: [-2, -2], 12: [-2, -2.1] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 10: [-1.6, -1.6], 11: [-1.7, -1.7], 12: [-1.7, -1.8] } },
        ],
      },
    ],
  },
  chest: {
    id: 600,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [249, 266], 11: [270, 287], 12: [291, 301] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [249, 266], 11: [270, 287], 12: [291, 301] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [249, 266], 11: [270, 287], 12: [291, 301] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [249, 266], 11: [270, 287], 12: [291, 301] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [249, 266], 11: [270, 287], 12: [291, 301] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [44, 47], 11: [48, 52], 12: [53, 55] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [44, 47], 11: [48, 52], 12: [53, 55] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [44, 47], 11: [48, 52], 12: [53, 55] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [44, 47], 11: [48, 52], 12: [53, 55] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [44, 47], 11: [48, 52], 12: [53, 55] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [630, 646], 11: [661, 677], 12: [692, 708] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [630, 646], 11: [661, 677], 12: [692, 708] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [5.8, 6], 11: [6.2, 6.3], 12: [6.5, 6.7] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 10: [3.5, 3.6], 11: [3.7, 3.8], 12: [3.9, 4] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 10: [655, 671], 11: [688, 704], 12: [721, 737] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 10: [-3, -3.1], 11: [-3.1, -3.2], 12: [-3.3, -3.5] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 10: [-3, -3.1], 11: [-3.1, -3.2], 12: [-3.3, -3.5] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 10: [-2.5, -2.6], 11: [-2.6, -2.7], 12: [-2.7, -2.8] } },
        ],
      },
    ],
  },
  legs: {
    id: 601,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [199, 213], 11: [216, 229], 12: [233, 242] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [199, 213], 11: [216, 229], 12: [233, 242] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [199, 213], 11: [216, 229], 12: [233, 242] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [199, 213], 11: [216, 229], 12: [233, 242] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [199, 213], 11: [216, 229], 12: [233, 242] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [36, 38], 11: [39, 41], 12: [42, 43] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [36, 38], 11: [39, 41], 12: [42, 43] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [36, 38], 11: [39, 41], 12: [42, 43] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [36, 38], 11: [39, 41], 12: [42, 43] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [36, 38], 11: [39, 41], 12: [42, 43] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [504, 517], 11: [529, 542], 12: [554, 567] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [504, 517], 11: [529, 542], 12: [554, 567] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [4.7, 4.8], 11: [4.9, 5.1], 12: [5.2, 5.3] } },
          { key: "block_mul", label: "Блокирование", isPercent: true, ranges: { 10: [2.8, 2.9], 11: [2.9, 3], 12: [3.1, 3.2] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 10: [524, 537], 11: [550, 563], 12: [576, 589] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 10: [-2.5, -2.5], 11: [-2.6, -2.7], 12: [-2.8, -2.9] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 10: [-2.5, -2.5], 11: [-2.6, -2.7], 12: [-2.8, -2.9] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 10: [-2, -2], 11: [-2.1, -2.2], 12: [-2.3, -2.4] } },
        ],
      },
    ],
  },
  hands: {
    id: 602,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [252, 258], 11: [264, 271], 12: [277, 283] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [252, 258], 11: [264, 271], 12: [277, 283] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [2.3, 2.4], 11: [2.4, 2.5], 12: [2.6, 2.7] } },
          { key: "block_mul", label: "Блокирование", isPercent: true, ranges: { 10: [1.4, 1.5], 11: [1.5, 1.6], 12: [1.6, 1.7] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 10: [262, 269], 11: [275, 282], 12: [288, 295] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 10: [-1.3, -1.3], 11: [-1.4, -1.4], 12: [-1.5, -1.5] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 10: [-1.3, -1.3], 11: [-1.4, -1.4], 12: [-1.5, -1.5] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 10: [-1, -1], 11: [-1.1, -1.1], 12: [-1.2, -1.2] } },
        ],
      },
    ],
  },
  feet: {
    id: 603,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [252, 258], 11: [264, 271], 12: [277, 283] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [252, 258], 11: [264, 271], 12: [277, 283] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [2.3, 2.4], 11: [2.4, 2.5], 12: [2.6, 2.7] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 10: [1.8, 1.9], 11: [1.9, 2], 12: [2, 2.1] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 10: [262, 269], 11: [275, 282], 12: [288, 295] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 10: [-1.3, -1.3], 11: [-1.4, -1.4], 12: [-1.5, -1.5] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 10: [-1.3, -1.3], 11: [-1.4, -1.4], 12: [-1.5, -1.5] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 10: [-1, -1], 11: [-1.1, -1.1], 12: [-1.2, -1.2] } },
        ],
      },
    ],
  },
  bracers: {
    id: 604,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [126, 129], 11: [132, 136], 12: [139, 142] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [126, 129], 11: [132, 136], 12: [139, 142] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [1.1, 1.2], 11: [1.2, 1.3], 12: [1.3, 1.4] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 10: [0.8, 0.9], 11: [0.9, 1], 12: [1, 1.1] } },
          { key: "move_speed_mul", label: "Скорость передвижения", isPercent: true, ranges: { 10: [2.5, 2.6], 11: [2.6, 2.7], 12: [2.8, 2.9] } },
          { key: "battle_resist", label: "Тактическая подготовка", isPercent: false, ranges: { 10: [124, 128], 11: [131, 135], 12: [138, 142] } },
          { key: "bulls_eye", label: "Меткость", isPercent: false, ranges: { 10: [100, 103], 11: [105, 108], 12: [110, 113] } },
          { key: "backattack_melee_damage_mul", label: "Урон в ближнем бою со спины", isPercent: true, ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] } },
          { key: "backattack_ranged_damage_mul", label: "Урон в дальнем бою со спины", isPercent: true, ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] } },
          { key: "backattack_spell_damage_mul", label: "Урон заклинаниями со спины", isPercent: true, ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] } },
        ],
      },
    ],
  },
  belt: {
    id: 605,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [126, 129], 11: [132, 136], 12: [139, 142] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [126, 129], 11: [132, 136], 12: [139, 142] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [1.1, 1.2], 11: [1.2, 1.3], 12: [1.3, 1.4] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 10: [0.8, 0.9], 11: [0.9, 1], 12: [1, 1.1] } },
          { key: "move_speed_mul", label: "Скорость передвижения", isPercent: true, ranges: { 10: [2.5, 2.6], 11: [2.6, 2.7], 12: [2.8, 2.9] } },
          { key: "battle_resist", label: "Тактическая подготовка", isPercent: false, ranges: { 10: [124, 128], 11: [131, 135], 12: [138, 142] } },
          { key: "bulls_eye", label: "Меткость", isPercent: false, ranges: { 10: [100, 103], 11: [105, 108], 12: [110, 113] } },
          { key: "backattack_melee_damage_mul", label: "Урон в ближнем бою со спины", isPercent: true, ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] } },
          { key: "backattack_ranged_damage_mul", label: "Урон в дальнем бою со спины", isPercent: true, ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] } },
          { key: "backattack_spell_damage_mul", label: "Урон заклинаниями со спины", isPercent: true, ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] } },
        ],
      },
    ],
  },
  head_base: {
    id: 53,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [146, 157], 11: [159, 169], 12: [172, 178] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [146, 157], 11: [159, 169], 12: [172, 178] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [146, 157], 11: [159, 169], 12: [172, 178] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [146, 157], 11: [159, 169], 12: [172, 178] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [146, 157], 11: [159, 169], 12: [172, 178] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [26, 28], 11: [28, 30], 12: [31, 32] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [26, 28], 11: [28, 30], 12: [31, 32] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [26, 28], 11: [28, 30], 12: [31, 32] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [26, 28], 11: [28, 30], 12: [31, 32] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [26, 28], 11: [28, 30], 12: [31, 32] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [2.3, 2.6], 11: [2.7, 3], 12: [3.1, 3.4] } },
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [247, 283], 11: [292, 330], 12: [340, 364] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [247, 283], 11: [292, 330], 12: [340, 364] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 10: [1.7, 1.9], 11: [2, 2.3], 12: [2.3, 2.5] } },
        ],
      },
    ],
  },
  chest_base: {
    id: 54,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [244, 261], 11: [265, 282], 12: [286, 296] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [244, 261], 11: [265, 282], 12: [286, 296] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [244, 261], 11: [265, 282], 12: [286, 296] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [244, 261], 11: [265, 282], 12: [286, 296] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [244, 261], 11: [265, 282], 12: [286, 296] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [43, 46], 11: [47, 50], 12: [51, 53] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [43, 46], 11: [47, 50], 12: [51, 53] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [43, 46], 11: [47, 50], 12: [51, 53] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [43, 46], 11: [47, 50], 12: [51, 53] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [43, 46], 11: [47, 50], 12: [51, 53] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [3.8, 4.3], 11: [4.5, 5], 12: [5.2, 5.6] } },
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [412, 471], 11: [486, 550], 12: [567, 607] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [412, 471], 11: [486, 550], 12: [567, 607] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 10: [2.3, 2.6], 11: [2.7, 3], 12: [3.1, 3.4] } },
        ],
      },
    ],
  },
  legs_base: {
    id: 55,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [195, 209], 11: [212, 225], 12: [229, 237] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [195, 209], 11: [212, 225], 12: [229, 237] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [195, 209], 11: [212, 225], 12: [229, 237] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [195, 209], 11: [212, 225], 12: [229, 237] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [195, 209], 11: [212, 225], 12: [229, 237] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 42] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 42] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 42] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 42] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 42] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [3, 3.5], 11: [3.6, 4], 12: [4.2, 4.5] } },
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [330, 377], 11: [389, 440], 12: [454, 486] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [330, 377], 11: [389, 440], 12: [454, 486] } },
          { key: "block_mul", label: "Блокирование", isPercent: true, ranges: { 10: [1.8, 2.1], 11: [2.2, 2.4], 12: [2.5, 2.7] } },
        ],
      },
    ],
  },
  hands_base: {
    id: 56,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [1.5, 1.8], 11: [1.8, 2], 12: [2.1, 2.3] } },
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [165, 189], 11: [195, 220], 12: [227, 243] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [165, 189], 11: [195, 220], 12: [227, 243] } },
          { key: "block_mul", label: "Блокирование", isPercent: true, ranges: { 10: [0.9, 1.1], 11: [1.1, 1.2], 12: [1.3, 1.4] } },
        ],
      },
    ],
  },
  feet_base: {
    id: 57,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [1.5, 1.8], 11: [1.8, 2], 12: [2.1, 2.3] } },
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [165, 189], 11: [195, 220], 12: [227, 243] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [165, 189], 11: [195, 220], 12: [227, 243] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 10: [1.2, 1.3], 11: [1.4, 1.5], 12: [1.6, 1.7] } },
        ],
      },
    ],
  },
  bracers_base: {
    id: 58,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [0.8, 0.9], 11: [0.9, 1], 12: [1.1, 1.2] } },
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [83, 95], 11: [98, 110], 12: [114, 122] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [83, 95], 11: [98, 110], 12: [114, 122] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 10: [0.6, 0.7], 11: [0.7, 0.8], 12: [0.8, 0.9] } },
        ],
      },
    ],
  },
  belt_base: {
    id: 59,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 10: [0.8, 0.9], 11: [0.9, 1], 12: [1.1, 1.2] } },
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 10: [83, 95], 11: [98, 110], 12: [114, 122] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 10: [83, 95], 11: [98, 110], 12: [114, 122] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 10: [0.6, 0.7], 11: [0.7, 0.8], 12: [0.8, 0.9] } },
        ],
      },
    ],
  },
  weapon_1h_base: {
    id: 50,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "attack_speed_mul", label: "Сноровка", isPercent: false, ranges: { 10: [41, 47], 11: [49, 55], 12: [57, 60] } },
          { key: "casting_time_mul", label: "Время применения умений", isPercent: true, ranges: { 10: [-3.1, -3.5], 11: [-3.7, -4.1], 12: [-4.3, -4.5] } },
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 10: [2.5, 2.8], 11: [2.9, 3.3], 12: [3.4, 3.6] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 10: [2.5, 2.8], 11: [2.9, 3.3], 12: [3.4, 3.6] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 10: [2.5, 2.8], 11: [2.9, 3.3], 12: [3.4, 3.6] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 10: [2.5, 2.8], 11: [2.9, 3.3], 12: [3.4, 3.6] } },
        ],
      },
    ],
  },
  weapon_2h_base: {
    id: 51,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [196, 208], 11: [212, 225], 12: [228, 237] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [196, 208], 11: [212, 225], 12: [228, 237] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [196, 208], 11: [212, 225], 12: [228, 237] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [196, 208], 11: [212, 225], 12: [228, 237] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [196, 208], 11: [212, 225], 12: [228, 237] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 43] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 43] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 43] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 43] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 43] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "attack_speed_mul", label: "Сноровка", isPercent: false, ranges: { 10: [73, 84], 11: [88, 99], 12: [102, 108] } },
          { key: "casting_time_mul", label: "Время применения умений", isPercent: true, ranges: { 10: [-5.6, -6.3], 11: [-6.7, -7.4], 12: [-7.8, -8.1] } },
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 10: [4.5, 5], 11: [5.2, 5.9], 12: [6.1, 6.4] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 10: [4.5, 5], 11: [5.2, 5.9], 12: [6.1, 6.4] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 10: [4.5, 5], 11: [5.2, 5.9], 12: [6.1, 6.4] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 10: [4.5, 5], 11: [5.2, 5.9], 12: [6.1, 6.4] } },
        ],
      },
    ],
  },
  weapon_bow_base: {
    id: 52,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "persistent_health_regen", label: "Восстановление здоровья в бою", isPercent: false, ranges: { 10: [4, 4], 11: [5, 5], 12: [5, 6] } },
          { key: "persistent_mana_regen", label: "Восстановление маны в бою", isPercent: false, ranges: { 10: [4, 4], 11: [5, 5], 12: [5, 6] } },
          { key: "ignore_armor", label: "Пробивание брони", isPercent: false, ranges: { 10: [143, 163], 11: [169, 191], 12: [197, 210] } },
          { key: "magic_penetration", label: "Игнорирование сопротивления", isPercent: false, ranges: { 10: [143, 163], 11: [169, 191], 12: [197, 210] } },
        ],
      },
    ],
  },
  instrument_base: {
    id: 49,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "melee_dps_inc", label: "Сила атаки в ближнем бою", isPercent: false, ranges: { 10: [8.2, 9.4], 11: [9.7, 10.9], 12: [11.3, 12] } },
          { key: "ranged_dps_inc", label: "Сила атаки в дальнем бою", isPercent: false, ranges: { 10: [8.2, 9.4], 11: [9.7, 10.9], 12: [11.3, 12] } },
          { key: "spell_dps_inc", label: "Сила заклинаний", isPercent: false, ranges: { 10: [8.2, 9.4], 11: [9.7, 10.9], 12: [11.3, 12] } },
          { key: "heal_dps_inc", label: "Эффективность исцеления", isPercent: false, ranges: { 10: [8.2, 9.4], 11: [9.7, 10.9], 12: [11.3, 12] } },
        ],
      },
    ],
  },
  head_brilliant: {
    id: 716,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [167, 178], 12: [181, 192] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [167, 178], 12: [181, 192] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [167, 178], 12: [181, 192] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [167, 178], 12: [181, 192] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [167, 178], 12: [181, 192] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [30, 32], 12: [33, 35] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [30, 32], 12: [33, 35] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [30, 32], 12: [33, 35] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [30, 32], 12: [33, 35] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [30, 32], 12: [33, 35] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [432, 441], 12: [450, 473] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [429, 440], 12: [450, 473] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [4, 4.2], 12: [4.3, 4.5] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 11: [2.9, 3], 12: [3, 3.2] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 11: [449, 458], 12: [467, 490] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 11: [-2.1, -2.2], 12: [-2.4, -2.5] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 11: [-2.1, -2.2], 12: [-2.4, -2.5] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 11: [-1.8, -1.8], 12: [-1.9, -2] } },
        ],
      },
    ],
  },
  chest_brilliant: {
    id: 717,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [279, 296], 12: [300, 320] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [279, 296], 12: [300, 320] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [279, 296], 12: [300, 320] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [279, 296], 12: [300, 320] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [279, 296], 12: [300, 320] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [50, 54], 12: [55, 59] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [50, 54], 12: [55, 59] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [50, 54], 12: [55, 59] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [50, 54], 12: [55, 59] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [50, 54], 12: [55, 59] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [720, 734], 12: [748, 785] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [715, 733], 12: [749, 789] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [6.7, 6.8], 12: [7, 7.5] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 11: [4, 4.2], 12: [4.3, 4.5] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 11: [749, 764], 12: [779, 818] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 11: [-3.6, -3.7], 12: [-3.8, -4] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 11: [-3.6, -3.7], 12: [-3.8, -4] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 11: [-2.9, -3], 12: [-3.1, -3.3] } },
        ],
      },
    ],
  },
  legs_brilliant: {
    id: 718,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [223, 236], 12: [240, 257] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [223, 236], 12: [240, 257] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [223, 236], 12: [240, 257] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [223, 236], 12: [240, 257] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [223, 236], 12: [240, 257] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [41, 43], 12: [44, 46] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [41, 43], 12: [44, 46] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [41, 43], 12: [44, 46] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [41, 43], 12: [44, 46] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [41, 43], 12: [44, 46] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [576, 587], 12: [598, 628] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [572, 587], 12: [599, 632] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [5.3, 5.5], 12: [5.6, 5.9] } },
          { key: "block_mul", label: "Блокирование", isPercent: true, ranges: { 11: [3.1, 3.2], 12: [3.3, 3.5] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 11: [599, 611], 12: [623, 654] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 11: [-2.9, -3], 12: [-3, -3.1] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 11: [-2.9, -3], 12: [-3, -3.1] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 11: [-2.4, -2.5], 12: [-2.5, -2.6] } },
        ],
      },
    ],
  },
  hands_brilliant: {
    id: 719,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [112, 119], 12: [121, 129] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [112, 119], 12: [121, 129] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [112, 119], 12: [121, 129] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [112, 119], 12: [121, 129] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [112, 119], 12: [121, 129] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [21, 22], 12: [23, 24] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [21, 22], 12: [23, 24] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [21, 22], 12: [23, 24] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [21, 22], 12: [23, 24] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [21, 22], 12: [23, 24] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [288, 294], 12: [300, 315] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [285, 294], 12: [300, 315] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [2.6, 2.7], 12: [2.8, 3] } },
          { key: "block_mul", label: "Блокирование", isPercent: true, ranges: { 11: [1.6, 1.7], 12: [1.7, 1.9] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 11: [299, 305], 12: [311, 327] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 11: [-1.3, -1.4], 12: [-1.5, -1.6] } },
        ],
      },
    ],
  },
  feet_brilliant: {
    id: 720,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [112, 119], 12: [121, 129] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [112, 119], 12: [121, 129] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [112, 119], 12: [121, 129] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [112, 119], 12: [121, 129] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [112, 119], 12: [121, 129] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [21, 22], 12: [23, 24] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [21, 22], 12: [23, 24] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [21, 22], 12: [23, 24] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [21, 22], 12: [23, 24] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [21, 22], 12: [23, 24] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [288, 294], 12: [300, 315] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [285, 294], 12: [300, 315] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [2.6, 2.7], 12: [2.8, 3] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 11: [2.1, 2.2], 12: [2.2, 2.4] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 11: [299, 305], 12: [311, 327] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 11: [-1.3, -1.4], 12: [-1.5, -1.6] } },
        ],
      },
    ],
  },
  bracers_brilliant: {
    id: 721,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [56, 60], 12: [61, 65] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [56, 60], 12: [61, 65] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [56, 60], 12: [61, 65] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [56, 60], 12: [61, 65] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [56, 60], 12: [61, 65] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [12, 12], 12: [13, 13] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [12, 12], 12: [13, 13] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [12, 12], 12: [13, 13] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [12, 12], 12: [13, 13] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [12, 12], 12: [13, 13] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [142, 148], 12: [151, 158] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [142, 148], 12: [151, 158] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [1.3, 1.4], 12: [1.4, 1.5] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 11: [1, 1.1], 12: [1.1, 1.2] } },
          { key: "move_speed_mul", label: "Скорость передвижения", isPercent: true, ranges: { 11: [2.9, 3], 12: [3.1, 3.3] } },
          { key: "battle_resist", label: "Тактическая подготовка", isPercent: false, ranges: { 11: [144, 148], 12: [152, 160] } },
          { key: "bulls_eye", label: "Меткость", isPercent: false, ranges: { 11: [115, 118], 12: [121, 127] } },
          { key: "backattack_melee_damage_mul", label: "Урон в ближнем бою со спины", isPercent: true, ranges: { 11: [3.6, 3.7], 12: [3.8, 4] } },
          { key: "backattack_ranged_damage_mul", label: "Урон в дальнем бою со спины", isPercent: true, ranges: { 11: [3.6, 3.7], 12: [3.8, 4] } },
          { key: "backattack_spell_damage_mul", label: "Урон заклинаниями со спины", isPercent: true, ranges: { 11: [3.6, 3.7], 12: [3.8, 4] } },
        ],
      },
    ],
  },
  belt_brilliant: {
    id: 722,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [56, 60], 12: [61, 65] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [56, 60], 12: [61, 65] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [56, 60], 12: [61, 65] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [56, 60], 12: [61, 65] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [56, 60], 12: [61, 65] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [12, 12], 12: [13, 13] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [12, 12], 12: [13, 13] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [12, 12], 12: [13, 13] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [12, 12], 12: [13, 13] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [12, 12], 12: [13, 13] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [142, 148], 12: [151, 158] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [142, 148], 12: [151, 158] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [1.3, 1.4], 12: [1.4, 1.5] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 11: [1, 1.1], 12: [1.1, 1.2] } },
          { key: "move_speed_mul", label: "Скорость передвижения", isPercent: true, ranges: { 11: [2.9, 3], 12: [3.1, 3.3] } },
          { key: "battle_resist", label: "Тактическая подготовка", isPercent: false, ranges: { 11: [144, 148], 12: [152, 160] } },
          { key: "bulls_eye", label: "Меткость", isPercent: false, ranges: { 11: [115, 118], 12: [121, 127] } },
          { key: "backattack_melee_damage_mul", label: "Урон в ближнем бою со спины", isPercent: true, ranges: { 11: [3.6, 3.7], 12: [3.8, 4] } },
          { key: "backattack_ranged_damage_mul", label: "Урон в дальнем бою со спины", isPercent: true, ranges: { 11: [3.6, 3.7], 12: [3.8, 4] } },
          { key: "backattack_spell_damage_mul", label: "Урон заклинаниями со спины", isPercent: true, ranges: { 11: [3.6, 3.7], 12: [3.8, 4] } },
        ],
      },
    ],
  },
  weapon_1h_brilliant: {
    id: 712,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "attack_speed_mul", label: "Сноровка", isPercent: false, ranges: { 11: [58, 59], 12: [60, 63] } },
          { key: "casting_time_mul", label: "Время применения умений", isPercent: true, ranges: { 11: [-3.7, -3.8], 12: [-3.9, -4.1] } },
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] } },
          { key: "melee_critical_bonus", label: "Критический урон в ближнем бою", isPercent: true, ranges: { 11: [17.3, 17.7], 12: [18.1, 19] } },
          { key: "ranged_critical_bonus", label: "Критический урон в дальнем бою", isPercent: true, ranges: { 11: [17.3, 17.7], 12: [18.1, 19] } },
          { key: "spell_critical_bonus", label: "Критический урон заклинаний", isPercent: true, ranges: { 11: [17.3, 17.7], 12: [18.1, 19] } },
          { key: "heal_critical_bonus", label: "Критический эффект исцеления", isPercent: true, ranges: { 11: [17.3, 17.7], 12: [18.1, 19] } },
          { key: "ignore_armor", label: "Пробивание брони", isPercent: false, ranges: { 11: [691, 705], 12: [719, 755] } },
          { key: "magic_penetration", label: "Игнорирование сопротивления", isPercent: false, ranges: { 11: [691, 705], 12: [719, 755] } },
        ],
      },
    ],
  },
  weapon_2h_brilliant: {
    id: 713,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [223, 235], 12: [239, 257] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [223, 235], 12: [239, 257] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [223, 235], 12: [239, 257] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [223, 235], 12: [239, 257] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [223, 235], 12: [239, 257] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [41, 45], 12: [45, 48] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [41, 45], 12: [45, 48] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [41, 45], 12: [45, 48] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [41, 45], 12: [45, 48] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [41, 45], 12: [45, 48] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "attack_speed_mul", label: "Сноровка", isPercent: false, ranges: { 11: [104, 106], 12: [108, 113] } },
          { key: "casting_time_mul", label: "Время применения умений", isPercent: true, ranges: { 11: [-6.7, -6.9], 12: [-7.1, -7.4] } },
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] } },
          { key: "melee_critical_bonus", label: "Критический урон в ближнем бою", isPercent: true, ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] } },
          { key: "ranged_critical_bonus", label: "Критический урон в дальнем бою", isPercent: true, ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] } },
          { key: "spell_critical_bonus", label: "Критический урон заклинаний", isPercent: true, ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] } },
          { key: "heal_critical_bonus", label: "Критический эффект исцеления", isPercent: true, ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] } },
          { key: "ignore_armor", label: "Пробивание брони", isPercent: false, ranges: { 11: [1243, 1269], 12: [1294, 1359] } },
          { key: "magic_penetration", label: "Игнорирование сопротивления", isPercent: false, ranges: { 11: [1243, 1269], 12: [1294, 1359] } },
        ],
      },
    ],
  },
  weapon_bow_brilliant: {
    id: 714,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "ignore_armor", label: "Пробивание брони", isPercent: false, ranges: { 11: [590, 601], 12: [612, 643] } },
          { key: "magic_penetration", label: "Игнорирование сопротивления", isPercent: false, ranges: { 11: [588, 601], 12: [615, 646] } },
          { key: "persistent_health_regen", label: "Восстановление здоровья в бою", isPercent: false, ranges: { 11: [6, 6], 12: [6, 7] } },
          { key: "persistent_mana_regen", label: "Восстановление маны в бою", isPercent: false, ranges: { 11: [6, 6], 12: [6, 7] } },
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 11: [5.3, 5.5], 12: [5.6, 5.9] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 11: [5.3, 5.5], 12: [5.6, 5.9] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 11: [5.3, 5.5], 12: [5.6, 5.9] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 11: [5.3, 5.5], 12: [5.6, 5.9] } },
          { key: "melee_critical_bonus", label: "Критический урон в ближнем бою", isPercent: true, ranges: { 11: [15.1, 15.4], 12: [15.7, 16.5] } },
          { key: "ranged_critical_bonus", label: "Критический урон в дальнем бою", isPercent: true, ranges: { 11: [15.1, 15.4], 12: [15.7, 16.5] } },
          { key: "spell_critical_bonus", label: "Критический урон заклинаний", isPercent: true, ranges: { 11: [15.1, 15.4], 12: [15.7, 16.5] } },
          { key: "heal_critical_bonus", label: "Критический эффект исцеления", isPercent: true, ranges: { 11: [15.1, 15.4], 12: [15.8, 16.6] } },
        ],
      },
    ],
  },
  instrument_brilliant: {
    id: 715,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [124, 131], 12: [133, 143] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [23, 25], 12: [25, 27] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "melee_dps_inc", label: "Сила атаки в ближнем бою", isPercent: false, ranges: { 11: [21.6, 22], 12: [22.4, 23.5] } },
          { key: "ranged_dps_inc", label: "Сила атаки в дальнем бою", isPercent: false, ranges: { 11: [21.6, 22], 12: [22.4, 23.5] } },
          { key: "spell_dps_inc", label: "Сила заклинаний", isPercent: false, ranges: { 11: [21.6, 22], 12: [22.4, 23.5] } },
          { key: "heal_dps_inc", label: "Эффективность исцеления", isPercent: false, ranges: { 11: [21.6, 22], 12: [22.4, 23.5] } },
          { key: "block_mul", label: "Блокирование", isPercent: true, ranges: { 11: [3.4, 3.5], 12: [3.6, 3.8] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 11: [2.3, 2.4], 12: [2.5, 2.6] } },
          { key: "move_speed_mul", label: "Скорость передвижения", isPercent: true, ranges: { 11: [2.9, 3], 12: [3.1, 3.3] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 11: [4.6, 4.7], 12: [4.8, 5] } },
        ],
      },
    ],
  },
  head_refined: {
    id: 816,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [176, 188], 12: [188, 199] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [176, 188], 12: [188, 199] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [176, 188], 12: [188, 199] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [176, 188], 12: [188, 199] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [176, 188], 12: [188, 199] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [32, 34], 12: [34, 36] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [32, 34], 12: [34, 36] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [32, 34], 12: [34, 36] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [32, 34], 12: [34, 36] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [32, 34], 12: [34, 36] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [455, 465], 12: [468, 491] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [452, 464], 12: [468, 491] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [4.2, 4.4], 12: [4.5, 4.7] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 11: [3, 3.1], 12: [3.1, 3.3] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 11: [468, 478], 12: [480, 503] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 11: [-2.2, -2.3], 12: [-2.5, -2.6] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 11: [-2.2, -2.3], 12: [-2.5, -2.6] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 11: [-1.9, -1.9], 12: [-2, -2.1] } },
        ],
      },
    ],
  },
  chest_refined: {
    id: 817,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [294, 312], 12: [312, 332] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [294, 312], 12: [312, 332] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [294, 312], 12: [312, 332] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [294, 312], 12: [312, 332] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [294, 312], 12: [312, 332] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [53, 57], 12: [57, 61] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [53, 57], 12: [57, 61] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [53, 57], 12: [57, 61] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [53, 57], 12: [57, 61] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [53, 57], 12: [57, 61] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [759, 774], 12: [777, 815] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [754, 773], 12: [778, 819] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [7.1, 7.2], 12: [7.3, 7.8] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 11: [4.3, 4.5], 12: [4.5, 4.7] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 11: [781, 797], 12: [801, 840] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 11: [-3.8, -3.9], 12: [-3.9, -4.1] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 11: [-3.8, -3.9], 12: [-3.9, -4.1] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 11: [-3, -3.1], 12: [-3.2, -3.4] } },
        ],
      },
    ],
  },
  legs_refined: {
    id: 818,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [235, 249], 12: [249, 267] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [235, 249], 12: [249, 267] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [235, 249], 12: [249, 267] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [235, 249], 12: [249, 267] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [235, 249], 12: [249, 267] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [43, 45], 12: [46, 48] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [43, 45], 12: [46, 48] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [43, 45], 12: [46, 48] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [43, 45], 12: [46, 48] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [43, 45], 12: [46, 48] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [607, 619], 12: [621, 652] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [603, 619], 12: [622, 656] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [5.6, 5.8], 12: [5.8, 6.1] } },
          { key: "block_mul", label: "Блокирование", isPercent: true, ranges: { 11: [3.3, 3.4], 12: [3.4, 3.6] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 11: [625, 637], 12: [640, 672] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 11: [-3, -3.1], 12: [-3.1, -3.2] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 11: [-3, -3.1], 12: [-3.1, -3.2] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 11: [-2.5, -2.6], 12: [-2.6, -2.7] } },
        ],
      },
    ],
  },
  hands_refined: {
    id: 819,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [118, 125], 12: [126, 134] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [118, 125], 12: [126, 134] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [118, 125], 12: [126, 134] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [118, 125], 12: [126, 134] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [118, 125], 12: [126, 134] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [22, 23], 12: [24, 25] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [22, 23], 12: [24, 25] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [22, 23], 12: [24, 25] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [22, 23], 12: [24, 25] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [22, 23], 12: [24, 25] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [304, 310], 12: [312, 327] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [300, 310], 12: [312, 327] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [2.7, 2.8], 12: [2.9, 3.1] } },
          { key: "block_mul", label: "Блокирование", isPercent: true, ranges: { 11: [1.7, 1.8], 12: [1.8, 2] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 11: [312, 318], 12: [320, 336] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 11: [-1.7, -1.8], 12: [-1.9, -2] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 11: [-1.7, -1.8], 12: [-1.9, -2] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 11: [-1.4, -1.5], 12: [-1.5, -1.6] } },
        ],
      },
    ],
  },
  feet_refined: {
    id: 820,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [118, 125], 12: [126, 134] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [118, 125], 12: [126, 134] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [118, 125], 12: [126, 134] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [118, 125], 12: [126, 134] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [118, 125], 12: [126, 134] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [22, 23], 12: [24, 25] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [22, 23], 12: [24, 25] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [22, 23], 12: [24, 25] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [22, 23], 12: [24, 25] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [22, 23], 12: [24, 25] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [304, 310], 12: [312, 327] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [300, 310], 12: [312, 327] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [2.7, 2.8], 12: [2.9, 3.1] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 11: [2.2, 2.3], 12: [2.3, 2.5] } },
          { key: "flexibility", label: "Устойчивость к критическому урону", isPercent: false, ranges: { 11: [312, 318], 12: [320, 336] } },
          { key: "incoming_melee_damage_mul", label: "Получаемый урон в ближнем бою", isPercent: true, ranges: { 11: [-1.7, -1.8], 12: [-1.9, -2] } },
          { key: "incoming_ranged_damage_mul", label: "Получаемый урон в дальнем бою", isPercent: true, ranges: { 11: [-1.7, -1.8], 12: [-1.9, -2] } },
          { key: "incoming_spell_damage_mul", label: "Получаемый урон от заклинаний", isPercent: true, ranges: { 11: [-1.4, -1.5], 12: [-1.5, -1.6] } },
        ],
      },
    ],
  },
  bracers_refined: {
    id: 821,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [59, 63], 12: [63, 68] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [59, 63], 12: [63, 68] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [59, 63], 12: [63, 68] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [59, 63], 12: [63, 68] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [59, 63], 12: [63, 68] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [13, 13], 12: [14, 14] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [13, 13], 12: [14, 14] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [13, 13], 12: [14, 14] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [13, 13], 12: [14, 14] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [13, 13], 12: [14, 14] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [150, 156], 12: [157, 164] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [150, 156], 12: [157, 164] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [1.4, 1.5], 12: [1.5, 1.6] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 11: [1.1, 1.2], 12: [1.2, 1.3] } },
          { key: "move_speed_mul", label: "Скорость передвижения", isPercent: true, ranges: { 11: [3.1, 3.2], 12: [3.2, 3.4] } },
          { key: "battle_resist", label: "Тактическая подготовка", isPercent: false, ranges: { 11: [150, 154], 12: [156, 164] } },
          { key: "bulls_eye", label: "Меткость", isPercent: false, ranges: { 11: [120, 123], 12: [124, 130] } },
          { key: "backattack_melee_damage_mul", label: "Урон в ближнем бою со спины", isPercent: true, ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] } },
          { key: "backattack_ranged_damage_mul", label: "Урон в дальнем бою со спины", isPercent: true, ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] } },
          { key: "backattack_spell_damage_mul", label: "Урон заклинаниями со спины", isPercent: true, ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] } },
        ],
      },
    ],
  },
  belt_refined: {
    id: 822,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [59, 63], 12: [63, 68] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [59, 63], 12: [63, 68] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [59, 63], 12: [63, 68] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [59, 63], 12: [63, 68] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [59, 63], 12: [63, 68] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [13, 13], 12: [14, 14] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [13, 13], 12: [14, 14] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [13, 13], 12: [14, 14] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [13, 13], 12: [14, 14] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [13, 13], 12: [14, 14] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 11: [150, 156], 12: [157, 164] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 11: [150, 156], 12: [157, 164] } },
          { key: "incoming_heal_mul", label: "Восприимчивость к исцелению", isPercent: true, ranges: { 11: [1.4, 1.5], 12: [1.5, 1.6] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 11: [1.1, 1.2], 12: [1.2, 1.3] } },
          { key: "move_speed_mul", label: "Скорость передвижения", isPercent: true, ranges: { 11: [3.1, 3.2], 12: [3.2, 3.4] } },
          { key: "battle_resist", label: "Тактическая подготовка", isPercent: false, ranges: { 11: [150, 154], 12: [156, 164] } },
          { key: "bulls_eye", label: "Меткость", isPercent: false, ranges: { 11: [120, 123], 12: [124, 130] } },
          { key: "backattack_melee_damage_mul", label: "Урон в ближнем бою со спины", isPercent: true, ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] } },
          { key: "backattack_ranged_damage_mul", label: "Урон в дальнем бою со спины", isPercent: true, ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] } },
          { key: "backattack_spell_damage_mul", label: "Урон заклинаниями со спины", isPercent: true, ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] } },
        ],
      },
    ],
  },
  weapon_1h_refined: {
    id: 811,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "attack_speed_mul", label: "Сноровка", isPercent: false, ranges: { 11: [61, 62], 12: [62, 65] } },
          { key: "casting_time_mul", label: "Время применения умений", isPercent: true, ranges: { 11: [-3.9, -4], 12: [-4.1, -4.3] } },
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 11: [6.4, 6.5], 12: [6.5, 6.8] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 11: [6.4, 6.5], 12: [6.5, 6.8] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 11: [6.4, 6.5], 12: [6.5, 6.8] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 11: [6.4, 6.5], 12: [6.5, 6.8] } },
          { key: "melee_critical_bonus", label: "Критический урон в ближнем бою", isPercent: true, ranges: { 11: [18.1, 18.5], 12: [18.6, 19.5] } },
          { key: "ranged_critical_bonus", label: "Критический урон в дальнем бою", isPercent: true, ranges: { 11: [18.1, 18.5], 12: [18.6, 19.5] } },
          { key: "spell_critical_bonus", label: "Критический урон заклинаний", isPercent: true, ranges: { 11: [18.1, 18.5], 12: [18.6, 19.5] } },
          { key: "heal_critical_bonus", label: "Критический эффект исцеления", isPercent: true, ranges: { 11: [18.1, 18.5], 12: [18.6, 19.5] } },
          { key: "ignore_armor", label: "Пробивание брони", isPercent: false, ranges: { 11: [720, 734], 12: [738, 775] } },
          { key: "magic_penetration", label: "Игнорирование сопротивления", isPercent: false, ranges: { 11: [720, 734], 12: [738, 775] } },
        ],
      },
    ],
  },
  weapon_2h_refined: {
    id: 812,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [235, 248], 12: [248, 267] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [235, 248], 12: [248, 267] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [235, 248], 12: [248, 267] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [235, 248], 12: [248, 267] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [235, 248], 12: [248, 267] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [43, 47], 12: [47, 50] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [43, 47], 12: [47, 50] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [43, 47], 12: [47, 50] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [43, 47], 12: [47, 50] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [43, 47], 12: [47, 50] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "attack_speed_mul", label: "Сноровка", isPercent: false, ranges: { 11: [110, 112], 12: [112, 117] } },
          { key: "casting_time_mul", label: "Время применения умений", isPercent: true, ranges: { 11: [-7.1, -7.3], 12: [-7.4, -7.7] } },
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 11: [11.4, 11.6], 12: [11.6, 12.1] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 11: [11.4, 11.6], 12: [11.6, 12.1] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 11: [11.4, 11.6], 12: [11.6, 12.1] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 11: [11.4, 11.6], 12: [11.6, 12.1] } },
          { key: "melee_critical_bonus", label: "Критический урон в ближнем бою", isPercent: true, ranges: { 11: [32.5, 33.2], 12: [33.4, 35.2] } },
          { key: "ranged_critical_bonus", label: "Критический урон в дальнем бою", isPercent: true, ranges: { 11: [32.5, 33.2], 12: [33.4, 35.2] } },
          { key: "spell_critical_bonus", label: "Критический урон заклинаний", isPercent: true, ranges: { 11: [32.5, 33.2], 12: [33.4, 35.2] } },
          { key: "heal_critical_bonus", label: "Критический эффект исцеления", isPercent: true, ranges: { 11: [32.5, 33.2], 12: [33.4, 35.2] } },
          { key: "ignore_armor", label: "Пробивание брони", isPercent: false, ranges: { 11: [1295, 1322], 12: [1328, 1394] } },
          { key: "magic_penetration", label: "Игнорирование сопротивления", isPercent: false, ranges: { 11: [1295, 1322], 12: [1328, 1394] } },
        ],
      },
    ],
  },
  weapon_bow_refined: {
    id: 813,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "ignore_armor", label: "Пробивание брони", isPercent: false, ranges: { 11: [615, 626], 12: [628, 660] } },
          { key: "magic_penetration", label: "Игнорирование сопротивления", isPercent: false, ranges: { 11: [612, 626], 12: [631, 663] } },
          { key: "persistent_health_regen", label: "Восстановление здоровья в бою", isPercent: false, ranges: { 11: [6, 7], 12: [7, 7] } },
          { key: "persistent_mana_regen", label: "Восстановление маны в бою", isPercent: false, ranges: { 11: [6, 7], 12: [7, 7] } },
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 11: [5.5, 5.7], 12: [5.8, 6.1] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 11: [5.5, 5.7], 12: [5.8, 6.1] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 11: [5.5, 5.7], 12: [5.8, 6.1] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 11: [5.5, 5.7], 12: [5.8, 6.1] } },
          { key: "melee_critical_bonus", label: "Критический урон в ближнем бою", isPercent: true, ranges: { 11: [15.8, 16.1], 12: [16.1, 17] } },
          { key: "ranged_critical_bonus", label: "Критический урон в дальнем бою", isPercent: true, ranges: { 11: [15.8, 16.1], 12: [16.1, 17] } },
          { key: "spell_critical_bonus", label: "Критический урон заклинаний", isPercent: true, ranges: { 11: [15.8, 16.1], 12: [16.1, 17] } },
          { key: "heal_critical_bonus", label: "Критический эффект исцеления", isPercent: true, ranges: { 11: [15.8, 16.1], 12: [16.1, 17] } },
        ],
      },
    ],
  },
  instrument_refined: {
    id: 814,
    minGrade: 11,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [131, 138], 12: [138, 149] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 11: [24, 26], 12: [26, 28] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "melee_dps_inc", label: "Сила атаки в ближнем бою", isPercent: false, ranges: { 11: [22.5, 22.9], 12: [23, 24.1] } },
          { key: "ranged_dps_inc", label: "Сила атаки в дальнем бою", isPercent: false, ranges: { 11: [22.5, 22.9], 12: [23, 24.1] } },
          { key: "spell_dps_inc", label: "Сила заклинаний", isPercent: false, ranges: { 11: [22.5, 22.9], 12: [23, 24.1] } },
          { key: "heal_dps_inc", label: "Эффективность исцеления", isPercent: false, ranges: { 11: [22.5, 22.9], 12: [23, 24.1] } },
          { key: "block_mul", label: "Блокирование", isPercent: true, ranges: { 11: [3.6, 3.7], 12: [3.7, 3.9] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 11: [2.4, 2.5], 12: [2.6, 2.7] } },
          { key: "move_speed_mul", label: "Скорость передвижения", isPercent: true, ranges: { 11: [3.1, 3.2], 12: [3.2, 3.4] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 11: [4.9, 5], 12: [5, 5.2] } },
        ],
      },
    ],
  },
  earring_brilliant: {
    id: 4,
    minGrade: 12,
    groups: [
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 12: [42, 46] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 12: [42, 46] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 12: [42, 46] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 12: [42, 46] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 12: [42, 46] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "str", label: "Сила", isPercent: false, ranges: { 12: [9, 9] } },
          { key: "dex", label: "Ловкость", isPercent: false, ranges: { 12: [9, 9] } },
          { key: "sta", label: "Выносливость", isPercent: false, ranges: { 12: [9, 9] } },
          { key: "int", label: "Интеллект", isPercent: false, ranges: { 12: [9, 9] } },
          { key: "spi", label: "Сила духа", isPercent: false, ranges: { 12: [9, 9] } },
        ],
      },
      {
        pickCount: 2,
        options: [
          { key: "resist", label: "Сопротивление", isPercent: false, ranges: { 12: [366, 398] } },
          { key: "dodge_mul", label: "Уклонение", isPercent: true, ranges: { 12: [3.6, 3.7] } },
          { key: "melee_parry_mul", label: "Парирование атак ближнего боя", isPercent: true, ranges: { 12: [3.6, 3.7] } },
          { key: "hit_reaction_delay_mul", label: "Задержка применения умений при получении удара", isPercent: true, ranges: { 12: [73, 75] } },
          { key: "max_mana", label: "Мана", isPercent: false, ranges: { 12: [848, 930] } },
          { key: "armor", label: "Защита", isPercent: false, ranges: { 12: [366, 398] } },
          { key: "incoming_damage_mul", label: "Получаемый урон", isPercent: true, ranges: { 12: [-3.6, -3.7] } },
          { key: "max_health", label: "Здоровье", isPercent: false, ranges: { 12: [1146, 1270] } },
        ],
      },
    ],
  },
  dracordis_omniconsuming: {
    id: 5,
    minGrade: 12,
    groups: [
      {
        pickCount: 2,
        options: [
          { key: "melee_critical_mul", label: "Шанс критического удара в ближнем бою", isPercent: true, ranges: { 12: [6.9, 7.2] } },
          { key: "ranged_critical_mul", label: "Шанс критического удара в дальнем бою", isPercent: true, ranges: { 12: [6.9, 7.2] } },
          { key: "spell_critical_mul", label: "Шанс критического удара заклинанием", isPercent: true, ranges: { 12: [6.9, 7.2] } },
          { key: "heal_critical_mul", label: "Шанс критического эффекта исцеления", isPercent: true, ranges: { 12: [6.9, 7.2] } },
          { key: "melee_skill_dmg", label: "Доп. урон умений ближнего боя", isPercent: true, ranges: { 12: [4.5, 4.7] } },
          { key: "ranged_skill_dmg", label: "Доп. урон умений дальнего боя", isPercent: true, ranges: { 12: [4.5, 4.7] } },
          { key: "spell_skill_dmg", label: "Доп. урон умений заклинателя", isPercent: true, ranges: { 12: [4.5, 4.7] } },
          { key: "skill_time_mul", label: "Время применения умений", isPercent: true, ranges: { 12: [-4.2, -4.4] } },
          { key: "proficiency", label: "Сноровка", isPercent: false, ranges: { 12: [65, 68] } },
          { key: "armor_penetration", label: "Пробивание брони", isPercent: false, ranges: { 12: [760, 797] } },
          { key: "resist_ignore", label: "Игнорирование сопротивления", isPercent: false, ranges: { 12: [760, 797] } },
          { key: "heal_effectiveness_bonus", label: "Доп. эффективность умений целителя", isPercent: true, ranges: { 12: [4.5, 4.7] } },
        ],
      },
      {
        pickCount: 1,
        options: [
          { key: "melee_skill_dmg_pvp", label: "Дополнительный урон умений ближнего боя в PvP", isPercent: true, ranges: { 12: [0.1, 0.5] } },
          { key: "ranged_skill_dmg_pvp", label: "Дополнительный урон умений дальнего боя в PvP", isPercent: true, ranges: { 12: [0.1, 0.5] } },
          { key: "spell_skill_dmg_pvp", label: "Дополнительный урон умений заклинателя в PvP", isPercent: true, ranges: { 12: [0.1, 0.5] } },
          { key: "melee_skill_dmg_pve", label: "Доп. урон умений ближнего боя в PvE", isPercent: true, ranges: { 12: [0.5, 1.0] } },
          { key: "ranged_skill_dmg_pve", label: "Доп. урон умений дальнего боя в PvE", isPercent: true, ranges: { 12: [0.5, 1.0] } },
          { key: "spell_skill_dmg_pve", label: "Доп. урон умений заклинателя в PvE", isPercent: true, ranges: { 12: [0.5, 1.0] } },
          { key: "heal_skill_dmg_pve", label: "Урон исцеляющими умениями в PvE", isPercent: true, ranges: { 12: [0.5, 1.0] } },
        ],
      },
    ],
  },
};
