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
  | LegendaryWeaponKey
  // Рамианская линейка (item_rnd_attr_category "ancient_stats"/"ancient_bonus"/
  // "ancient_bonus_PvE" в игровой базе) переиспользует этот же механизм синтеза —
  // категория на грейд 11-12 у каждого сочетания слот+тир. Ключ повторяет
  // структуру игрового group-set name (`live.<патч>.<slot>.ancient_*`):
  // `ramian_<slot>_<патч>_<db category id>`, например `ramian_armor_head_18_03_500` —
  // так по имени легко найти исходную строку в item_rnd_attr_unit_modifier_group_sets.
  | `ramian_${string}`
  // Аксессуары "Ожерелье проводника/последнего рубежа" и "Дома Норьетт"
  // (item_rnd_attr_category "main_stat"/"sub_stat"/"bonus" на аксессуарах,
  // патчи 18.12/19.09/23.03) — та же механика, но с точками грейда ниже
  // 10 (некоторые уже с грейда 0) и своим шагом на каждый грейд, а не
  // только на 10/11/12. Ключ так же повторяет структуру group-set name:
  // `ephen_<slot>_<патч или "base">_<db category id>`.
  | `ephen_${string}`;

// Диапазон синтеза известен не только на 10/11/12 (как у большинства обычной
// эфенской брони/оружия) — у аксессуаров конкретный грейд, с которого
// появляется значение, свой для каждого предмета (см. minGrade), и шаг
// на каждый следующий грейд отдельный. Поэтому ranges держит любой грейд
// 0-12 (кроме 1 — он всегда совпадает с "обычным" отсутствием бонуса).
export type EphenSynthesisGrade =
  | 0
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;

export type EphenSynthesisOption = {
  key: string;
  label: string;
  isPercent: boolean;
  ranges: Partial<Record<EphenSynthesisGrade, [number, number]>>;
};

export type EphenSynthesisGroup = {
  pickCount: number;
  options: EphenSynthesisOption[];
};

export type EphenSynthesisCategory = {
  id: number;
  minGrade: EphenSynthesisGrade;
  groups: EphenSynthesisGroup[];
};

// Возвращает диапазон опции на грейде `grade`: сам этот грейд, если для
// него есть данные, иначе — ближайший НИЖЕ него из тех, что есть (т.к. в
// игре значение остаётся таким, каким было на последнем грейде, где оно
// в последний раз менялось). Используется везде вместо старого захардко-
// женного "grade >= 12 ? 12 : grade >= 11 ? 11 : minGrade", который не
// учитывал промежуточные точки (5/6/7/8/9/10) у аксессуаров.
export function getEphenSynthesisOptionRange(
  option: EphenSynthesisOption,
  grade: number,
  minGrade: number,
): [number, number] | undefined {
  const available = (Object.keys(option.ranges) as unknown as number[])
    .map(Number)
    .filter((g) => g <= grade)
    .sort((a, b) => b - a);
  const bestGrade = available[0] ?? minGrade;
  return option.ranges[bestGrade as EphenSynthesisGrade];
}

export const EPHEN_SYNTHESIS_CATEGORIES: Partial<
  Record<EphenSynthesisCategoryKey, EphenSynthesisCategory>
> = {
  weapon_1h: {
    id: 594,
    minGrade: 10,
    groups: [
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "attack_speed_mul",
            label: "Сноровка",
            isPercent: false,
            ranges: { 10: [40, 43], 11: [47, 50], 12: [54, 57] },
          },
          {
            key: "casting_time_mul",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 10: [-2.8, -3], 11: [-3.1, -3.3], 12: [-3.4, -3.6] },
          },
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 10: [5.3, 5.4], 11: [5.6, 5.7], 12: [5.9, 6] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 10: [5.3, 5.4], 11: [5.6, 5.7], 12: [5.9, 6] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 10: [5.3, 5.4], 11: [5.6, 5.7], 12: [5.9, 6] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 10: [5.3, 5.4], 11: [5.6, 5.7], 12: [5.9, 6] },
          },
          {
            key: "melee_critical_bonus",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 10: [15.1, 15.5], 11: [15.9, 16.2], 12: [16.6, 17] },
          },
          {
            key: "ranged_critical_bonus",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 10: [15.1, 15.5], 11: [15.9, 16.2], 12: [16.6, 17] },
          },
          {
            key: "spell_critical_bonus",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 10: [15.1, 15.5], 11: [15.9, 16.2], 12: [16.6, 17] },
          },
          {
            key: "heal_critical_bonus",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 10: [15.1, 15.5], 11: [15.9, 16.2], 12: [16.6, 17] },
          },
          {
            key: "ignore_armor",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 10: [604, 619], 11: [634, 650], 12: [665, 680] },
          },
          {
            key: "magic_penetration",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 10: [604, 619], 11: [634, 650], 12: [665, 680] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [199, 212], 11: [216, 228], 12: [232, 241] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [199, 212], 11: [216, 228], 12: [232, 241] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [199, 212], 11: [216, 228], 12: [232, 241] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [199, 212], 11: [216, 228], 12: [232, 241] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [199, 212], 11: [216, 228], 12: [232, 241] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [37, 39], 11: [39, 43], 12: [43, 45] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [37, 39], 11: [39, 43], 12: [43, 45] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [37, 39], 11: [39, 43], 12: [43, 45] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [37, 39], 11: [39, 43], 12: [43, 45] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [37, 39], 11: [39, 43], 12: [43, 45] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "attack_speed_mul",
            label: "Сноровка",
            isPercent: false,
            ranges: { 10: [72, 77], 11: [84, 90], 12: [97, 102] },
          },
          {
            key: "casting_time_mul",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 10: [-5.1, -5.4], 11: [-5.6, -6], 12: [-6.2, -6.5] },
          },
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 10: [9.5, 9.7], 11: [10, 10.2], 12: [10.6, 10.8] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 10: [9.5, 9.7], 11: [10, 10.2], 12: [10.6, 10.8] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 10: [9.5, 9.7], 11: [10, 10.2], 12: [10.6, 10.8] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 10: [9.5, 9.7], 11: [10, 10.2], 12: [10.6, 10.8] },
          },
          {
            key: "melee_critical_bonus",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 10: [27.1, 27.9], 11: [28.6, 29.1], 12: [29.8, 30.6] },
          },
          {
            key: "ranged_critical_bonus",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 10: [27.1, 27.9], 11: [28.6, 29.1], 12: [29.8, 30.6] },
          },
          {
            key: "spell_critical_bonus",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 10: [27.1, 27.9], 11: [28.6, 29.1], 12: [29.8, 30.6] },
          },
          {
            key: "heal_critical_bonus",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 10: [27.1, 27.9], 11: [28.6, 29.1], 12: [29.8, 30.6] },
          },
          {
            key: "ignore_armor",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 10: [1087, 1114], 11: [1141, 1170], 12: [1197, 1224] },
          },
          {
            key: "magic_penetration",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 10: [1087, 1114], 11: [1141, 1170], 12: [1197, 1224] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "ignore_armor",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 10: [518, 530], 11: [543, 555], 12: [568, 580] },
          },
          {
            key: "magic_penetration",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 10: [518, 530], 11: [543, 555], 12: [568, 580] },
          },
          {
            key: "persistent_health_regen",
            label: "Восстановление здоровья в бою",
            isPercent: false,
            ranges: { 10: [4, 5], 11: [5, 6], 12: [6, 6] },
          },
          {
            key: "persistent_mana_regen",
            label: "Восстановление маны в бою",
            isPercent: false,
            ranges: { 10: [4, 5], 11: [5, 6], 12: [6, 6] },
          },
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 10: [4.7, 4.8], 11: [4.9, 5.1], 12: [5.2, 5.3] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 10: [4.7, 4.8], 11: [4.9, 5.1], 12: [5.2, 5.3] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 10: [4.7, 4.8], 11: [4.9, 5.1], 12: [5.2, 5.3] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 10: [4.7, 4.8], 11: [4.9, 5.1], 12: [5.2, 5.3] },
          },
          {
            key: "melee_critical_bonus",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 10: [13.2, 13.5], 11: [13.9, 14.2], 12: [14.6, 14.9] },
          },
          {
            key: "ranged_critical_bonus",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 10: [13.2, 13.5], 11: [13.9, 14.2], 12: [14.6, 14.9] },
          },
          {
            key: "spell_critical_bonus",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 10: [13.2, 13.5], 11: [13.9, 14.2], 12: [14.6, 14.9] },
          },
          {
            key: "heal_critical_bonus",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 10: [13.2, 13.5], 11: [13.9, 14.2], 12: [14.6, 14.9] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [111, 118], 11: [120, 127], 12: [129, 134] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [21, 22], 11: [22, 24], 12: [24, 25] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "melee_dps_inc",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 10: [18.9, 19.4], 11: [19.8, 20.3], 12: [20.7, 21.2] },
          },
          {
            key: "ranged_dps_inc",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 10: [18.9, 19.4], 11: [19.8, 20.3], 12: [20.7, 21.2] },
          },
          {
            key: "spell_dps_inc",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 10: [18.9, 19.4], 11: [19.8, 20.3], 12: [20.7, 21.2] },
          },
          {
            key: "heal_dps_inc",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 10: [18.9, 19.4], 11: [19.8, 20.3], 12: [20.7, 21.2] },
          },
          {
            key: "block_mul",
            label: "Блокирование",
            isPercent: true,
            ranges: { 10: [3, 3.1], 11: [3.1, 3.2], 12: [3.2, 3.3] },
          },
          {
            key: "dodge_mul",
            label: "Уклонение",
            isPercent: true,
            ranges: { 10: [2, 2.1], 11: [2.1, 2.2], 12: [2.2, 2.3] },
          },
          {
            key: "move_speed_mul",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 10: [2.5, 2.6], 11: [2.6, 2.7], 12: [2.8, 2.9] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 10: [4, 4.1], 11: [4.2, 4.3], 12: [4.4, 4.5] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [148, 160], 11: [162, 172], 12: [175, 181] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [148, 160], 11: [162, 172], 12: [175, 181] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [148, 160], 11: [162, 172], 12: [175, 181] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [148, 160], 11: [162, 172], 12: [175, 181] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [148, 160], 11: [162, 172], 12: [175, 181] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [27, 29], 11: [29, 31], 12: [32, 33] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [27, 29], 11: [29, 31], 12: [32, 33] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [27, 29], 11: [29, 31], 12: [32, 33] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [27, 29], 11: [29, 31], 12: [32, 33] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [27, 29], 11: [29, 31], 12: [32, 33] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [378, 387], 11: [397, 406], 12: [416, 425] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [378, 387], 11: [397, 406], 12: [416, 425] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [3.5, 3.6], 11: [3.7, 3.8], 12: [3.9, 4] },
          },
          {
            key: "dodge_mul",
            label: "Уклонение",
            isPercent: true,
            ranges: { 10: [2.6, 2.7], 11: [2.7, 2.8], 12: [2.8, 2.9] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 10: [393, 403], 11: [413, 422], 12: [432, 442] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 10: [-1.9, -1.9], 11: [-2, -2], 12: [-2, -2.1] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 10: [-1.9, -1.9], 11: [-2, -2], 12: [-2, -2.1] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 10: [-1.6, -1.6], 11: [-1.7, -1.7], 12: [-1.7, -1.8] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [249, 266], 11: [270, 287], 12: [291, 301] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [249, 266], 11: [270, 287], 12: [291, 301] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [249, 266], 11: [270, 287], 12: [291, 301] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [249, 266], 11: [270, 287], 12: [291, 301] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [249, 266], 11: [270, 287], 12: [291, 301] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [44, 47], 11: [48, 52], 12: [53, 55] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [44, 47], 11: [48, 52], 12: [53, 55] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [44, 47], 11: [48, 52], 12: [53, 55] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [44, 47], 11: [48, 52], 12: [53, 55] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [44, 47], 11: [48, 52], 12: [53, 55] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [630, 646], 11: [661, 677], 12: [692, 708] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [630, 646], 11: [661, 677], 12: [692, 708] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [5.8, 6], 11: [6.2, 6.3], 12: [6.5, 6.7] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 10: [3.5, 3.6], 11: [3.7, 3.8], 12: [3.9, 4] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 10: [655, 671], 11: [688, 704], 12: [721, 737] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 10: [-3, -3.1], 11: [-3.1, -3.2], 12: [-3.3, -3.5] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 10: [-3, -3.1], 11: [-3.1, -3.2], 12: [-3.3, -3.5] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 10: [-2.5, -2.6], 11: [-2.6, -2.7], 12: [-2.7, -2.8] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [199, 213], 11: [216, 229], 12: [233, 242] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [199, 213], 11: [216, 229], 12: [233, 242] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [199, 213], 11: [216, 229], 12: [233, 242] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [199, 213], 11: [216, 229], 12: [233, 242] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [199, 213], 11: [216, 229], 12: [233, 242] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [36, 38], 11: [39, 41], 12: [42, 43] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [36, 38], 11: [39, 41], 12: [42, 43] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [36, 38], 11: [39, 41], 12: [42, 43] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [36, 38], 11: [39, 41], 12: [42, 43] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [36, 38], 11: [39, 41], 12: [42, 43] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [504, 517], 11: [529, 542], 12: [554, 567] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [504, 517], 11: [529, 542], 12: [554, 567] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [4.7, 4.8], 11: [4.9, 5.1], 12: [5.2, 5.3] },
          },
          {
            key: "block_mul",
            label: "Блокирование",
            isPercent: true,
            ranges: { 10: [2.8, 2.9], 11: [2.9, 3], 12: [3.1, 3.2] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 10: [524, 537], 11: [550, 563], 12: [576, 589] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 10: [-2.5, -2.5], 11: [-2.6, -2.7], 12: [-2.8, -2.9] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 10: [-2.5, -2.5], 11: [-2.6, -2.7], 12: [-2.8, -2.9] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 10: [-2, -2], 11: [-2.1, -2.2], 12: [-2.3, -2.4] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [252, 258], 11: [264, 271], 12: [277, 283] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [252, 258], 11: [264, 271], 12: [277, 283] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [2.3, 2.4], 11: [2.4, 2.5], 12: [2.6, 2.7] },
          },
          {
            key: "block_mul",
            label: "Блокирование",
            isPercent: true,
            ranges: { 10: [1.4, 1.5], 11: [1.5, 1.6], 12: [1.6, 1.7] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 10: [262, 269], 11: [275, 282], 12: [288, 295] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 10: [-1.3, -1.3], 11: [-1.4, -1.4], 12: [-1.5, -1.5] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 10: [-1.3, -1.3], 11: [-1.4, -1.4], 12: [-1.5, -1.5] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 10: [-1, -1], 11: [-1.1, -1.1], 12: [-1.2, -1.2] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [99, 106], 11: [108, 115], 12: [117, 121] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [19, 20], 11: [20, 21], 12: [22, 22] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [252, 258], 11: [264, 271], 12: [277, 283] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [252, 258], 11: [264, 271], 12: [277, 283] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [2.3, 2.4], 11: [2.4, 2.5], 12: [2.6, 2.7] },
          },
          {
            key: "dodge_mul",
            label: "Уклонение",
            isPercent: true,
            ranges: { 10: [1.8, 1.9], 11: [1.9, 2], 12: [2, 2.1] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 10: [262, 269], 11: [275, 282], 12: [288, 295] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 10: [-1.3, -1.3], 11: [-1.4, -1.4], 12: [-1.5, -1.5] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 10: [-1.3, -1.3], 11: [-1.4, -1.4], 12: [-1.5, -1.5] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 10: [-1, -1], 11: [-1.1, -1.1], 12: [-1.2, -1.2] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [126, 129], 11: [132, 136], 12: [139, 142] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [126, 129], 11: [132, 136], 12: [139, 142] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [1.1, 1.2], 11: [1.2, 1.3], 12: [1.3, 1.4] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 10: [0.8, 0.9], 11: [0.9, 1], 12: [1, 1.1] },
          },
          {
            key: "move_speed_mul",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 10: [2.5, 2.6], 11: [2.6, 2.7], 12: [2.8, 2.9] },
          },
          {
            key: "battle_resist",
            label: "Тактическая подготовка",
            isPercent: false,
            ranges: { 10: [124, 128], 11: [131, 135], 12: [138, 142] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 10: [100, 103], 11: [105, 108], 12: [110, 113] },
          },
          {
            key: "backattack_melee_damage_mul",
            label: "Урон в ближнем бою со спины",
            isPercent: true,
            ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] },
          },
          {
            key: "backattack_ranged_damage_mul",
            label: "Урон в дальнем бою со спины",
            isPercent: true,
            ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] },
          },
          {
            key: "backattack_spell_damage_mul",
            label: "Урон заклинаниями со спины",
            isPercent: true,
            ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [50, 54], 11: [54, 58], 12: [59, 61] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [10, 11], 11: [11, 11], 12: [12, 12] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [126, 129], 11: [132, 136], 12: [139, 142] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [126, 129], 11: [132, 136], 12: [139, 142] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [1.1, 1.2], 11: [1.2, 1.3], 12: [1.3, 1.4] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 10: [0.8, 0.9], 11: [0.9, 1], 12: [1, 1.1] },
          },
          {
            key: "move_speed_mul",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 10: [2.5, 2.6], 11: [2.6, 2.7], 12: [2.8, 2.9] },
          },
          {
            key: "battle_resist",
            label: "Тактическая подготовка",
            isPercent: false,
            ranges: { 10: [124, 128], 11: [131, 135], 12: [138, 142] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 10: [100, 103], 11: [105, 108], 12: [110, 113] },
          },
          {
            key: "backattack_melee_damage_mul",
            label: "Урон в ближнем бою со спины",
            isPercent: true,
            ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] },
          },
          {
            key: "backattack_ranged_damage_mul",
            label: "Урон в дальнем бою со спины",
            isPercent: true,
            ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] },
          },
          {
            key: "backattack_spell_damage_mul",
            label: "Урон заклинаниями со спины",
            isPercent: true,
            ranges: { 10: [3.1, 3.2], 11: [3.3, 3.4], 12: [3.5, 3.6] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [146, 157], 11: [159, 169], 12: [172, 178] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [146, 157], 11: [159, 169], 12: [172, 178] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [146, 157], 11: [159, 169], 12: [172, 178] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [146, 157], 11: [159, 169], 12: [172, 178] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [146, 157], 11: [159, 169], 12: [172, 178] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [26, 28], 11: [28, 30], 12: [31, 32] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [26, 28], 11: [28, 30], 12: [31, 32] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [26, 28], 11: [28, 30], 12: [31, 32] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [26, 28], 11: [28, 30], 12: [31, 32] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [26, 28], 11: [28, 30], 12: [31, 32] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [2.3, 2.6], 11: [2.7, 3], 12: [3.1, 3.4] },
          },
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [247, 283], 11: [292, 330], 12: [340, 364] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [247, 283], 11: [292, 330], 12: [340, 364] },
          },
          {
            key: "dodge_mul",
            label: "Уклонение",
            isPercent: true,
            ranges: { 10: [1.7, 1.9], 11: [2, 2.3], 12: [2.3, 2.5] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [244, 261], 11: [265, 282], 12: [286, 296] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [244, 261], 11: [265, 282], 12: [286, 296] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [244, 261], 11: [265, 282], 12: [286, 296] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [244, 261], 11: [265, 282], 12: [286, 296] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [244, 261], 11: [265, 282], 12: [286, 296] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [43, 46], 11: [47, 50], 12: [51, 53] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [43, 46], 11: [47, 50], 12: [51, 53] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [43, 46], 11: [47, 50], 12: [51, 53] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [43, 46], 11: [47, 50], 12: [51, 53] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [43, 46], 11: [47, 50], 12: [51, 53] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [3.8, 4.3], 11: [4.5, 5], 12: [5.2, 5.6] },
          },
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [412, 471], 11: [486, 550], 12: [567, 607] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [412, 471], 11: [486, 550], 12: [567, 607] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 10: [2.3, 2.6], 11: [2.7, 3], 12: [3.1, 3.4] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [195, 209], 11: [212, 225], 12: [229, 237] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [195, 209], 11: [212, 225], 12: [229, 237] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [195, 209], 11: [212, 225], 12: [229, 237] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [195, 209], 11: [212, 225], 12: [229, 237] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [195, 209], 11: [212, 225], 12: [229, 237] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 42] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 42] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 42] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 42] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 42] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [3, 3.5], 11: [3.6, 4], 12: [4.2, 4.5] },
          },
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [330, 377], 11: [389, 440], 12: [454, 486] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [330, 377], 11: [389, 440], 12: [454, 486] },
          },
          {
            key: "block_mul",
            label: "Блокирование",
            isPercent: true,
            ranges: { 10: [1.8, 2.1], 11: [2.2, 2.4], 12: [2.5, 2.7] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [1.5, 1.8], 11: [1.8, 2], 12: [2.1, 2.3] },
          },
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [165, 189], 11: [195, 220], 12: [227, 243] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [165, 189], 11: [195, 220], 12: [227, 243] },
          },
          {
            key: "block_mul",
            label: "Блокирование",
            isPercent: true,
            ranges: { 10: [0.9, 1.1], 11: [1.1, 1.2], 12: [1.3, 1.4] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [98, 105], 11: [106, 113], 12: [115, 119] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [18, 19], 11: [19, 20], 12: [21, 21] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [1.5, 1.8], 11: [1.8, 2], 12: [2.1, 2.3] },
          },
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [165, 189], 11: [195, 220], 12: [227, 243] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [165, 189], 11: [195, 220], 12: [227, 243] },
          },
          {
            key: "dodge_mul",
            label: "Уклонение",
            isPercent: true,
            ranges: { 10: [1.2, 1.3], 11: [1.4, 1.5], 12: [1.6, 1.7] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [0.8, 0.9], 11: [0.9, 1], 12: [1.1, 1.2] },
          },
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [83, 95], 11: [98, 110], 12: [114, 122] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [83, 95], 11: [98, 110], 12: [114, 122] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 10: [0.6, 0.7], 11: [0.7, 0.8], 12: [0.8, 0.9] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [49, 53], 11: [53, 57], 12: [58, 60] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [9, 10], 11: [10, 10], 12: [11, 11] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 10: [0.8, 0.9], 11: [0.9, 1], 12: [1.1, 1.2] },
          },
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 10: [83, 95], 11: [98, 110], 12: [114, 122] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 10: [83, 95], 11: [98, 110], 12: [114, 122] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 10: [0.6, 0.7], 11: [0.7, 0.8], 12: [0.8, 0.9] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "attack_speed_mul",
            label: "Сноровка",
            isPercent: false,
            ranges: { 10: [41, 47], 11: [49, 55], 12: [57, 60] },
          },
          {
            key: "casting_time_mul",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 10: [-3.1, -3.5], 11: [-3.7, -4.1], 12: [-4.3, -4.5] },
          },
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 10: [2.5, 2.8], 11: [2.9, 3.3], 12: [3.4, 3.6] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 10: [2.5, 2.8], 11: [2.9, 3.3], 12: [3.4, 3.6] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 10: [2.5, 2.8], 11: [2.9, 3.3], 12: [3.4, 3.6] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 10: [2.5, 2.8], 11: [2.9, 3.3], 12: [3.4, 3.6] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [196, 208], 11: [212, 225], 12: [228, 237] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [196, 208], 11: [212, 225], 12: [228, 237] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [196, 208], 11: [212, 225], 12: [228, 237] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [196, 208], 11: [212, 225], 12: [228, 237] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [196, 208], 11: [212, 225], 12: [228, 237] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 43] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 43] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 43] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 43] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [38, 40], 12: [41, 43] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "attack_speed_mul",
            label: "Сноровка",
            isPercent: false,
            ranges: { 10: [73, 84], 11: [88, 99], 12: [102, 108] },
          },
          {
            key: "casting_time_mul",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 10: [-5.6, -6.3], 11: [-6.7, -7.4], 12: [-7.8, -8.1] },
          },
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 10: [4.5, 5], 11: [5.2, 5.9], 12: [6.1, 6.4] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 10: [4.5, 5], 11: [5.2, 5.9], 12: [6.1, 6.4] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 10: [4.5, 5], 11: [5.2, 5.9], 12: [6.1, 6.4] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 10: [4.5, 5], 11: [5.2, 5.9], 12: [6.1, 6.4] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "persistent_health_regen",
            label: "Восстановление здоровья в бою",
            isPercent: false,
            ranges: { 10: [4, 4], 11: [5, 5], 12: [5, 6] },
          },
          {
            key: "persistent_mana_regen",
            label: "Восстановление маны в бою",
            isPercent: false,
            ranges: { 10: [4, 4], 11: [5, 5], 12: [5, 6] },
          },
          {
            key: "ignore_armor",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 10: [143, 163], 11: [169, 191], 12: [197, 210] },
          },
          {
            key: "magic_penetration",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 10: [143, 163], 11: [169, 191], 12: [197, 210] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [109, 116], 11: [118, 125], 12: [127, 132] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [20, 21], 11: [21, 23], 12: [23, 24] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "melee_dps_inc",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 10: [8.2, 9.4], 11: [9.7, 10.9], 12: [11.3, 12] },
          },
          {
            key: "ranged_dps_inc",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 10: [8.2, 9.4], 11: [9.7, 10.9], 12: [11.3, 12] },
          },
          {
            key: "spell_dps_inc",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 10: [8.2, 9.4], 11: [9.7, 10.9], 12: [11.3, 12] },
          },
          {
            key: "heal_dps_inc",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 10: [8.2, 9.4], 11: [9.7, 10.9], 12: [11.3, 12] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [167, 178], 12: [181, 192] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [167, 178], 12: [181, 192] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [167, 178], 12: [181, 192] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [167, 178], 12: [181, 192] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [167, 178], 12: [181, 192] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [30, 32], 12: [33, 35] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [30, 32], 12: [33, 35] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [30, 32], 12: [33, 35] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [30, 32], 12: [33, 35] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [30, 32], 12: [33, 35] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [432, 441], 12: [450, 473] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [429, 440], 12: [450, 473] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [4, 4.2], 12: [4.3, 4.5] },
          },
          {
            key: "dodge_mul",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3, 3.2] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 11: [449, 458], 12: [467, 490] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.1, -2.2], 12: [-2.4, -2.5] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.1, -2.2], 12: [-2.4, -2.5] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.8, -1.8], 12: [-1.9, -2] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [279, 296], 12: [300, 320] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [279, 296], 12: [300, 320] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [279, 296], 12: [300, 320] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [279, 296], 12: [300, 320] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [279, 296], 12: [300, 320] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [50, 54], 12: [55, 59] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [50, 54], 12: [55, 59] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [50, 54], 12: [55, 59] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [50, 54], 12: [55, 59] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [50, 54], 12: [55, 59] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [720, 734], 12: [748, 785] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [715, 733], 12: [749, 789] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [6.7, 6.8], 12: [7, 7.5] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 11: [4, 4.2], 12: [4.3, 4.5] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 11: [749, 764], 12: [779, 818] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [-3.6, -3.7], 12: [-3.8, -4] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [-3.6, -3.7], 12: [-3.8, -4] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3.1, -3.3] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [223, 236], 12: [240, 257] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [223, 236], 12: [240, 257] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [223, 236], 12: [240, 257] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [223, 236], 12: [240, 257] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [223, 236], 12: [240, 257] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [41, 43], 12: [44, 46] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [41, 43], 12: [44, 46] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [41, 43], 12: [44, 46] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [41, 43], 12: [44, 46] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [41, 43], 12: [44, 46] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [576, 587], 12: [598, 628] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [572, 587], 12: [599, 632] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [5.3, 5.5], 12: [5.6, 5.9] },
          },
          {
            key: "block_mul",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [3.1, 3.2], 12: [3.3, 3.5] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 11: [599, 611], 12: [623, 654] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3, -3.1] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3, -3.1] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.4, -2.5], 12: [-2.5, -2.6] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [112, 119], 12: [121, 129] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [112, 119], 12: [121, 129] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [112, 119], 12: [121, 129] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [112, 119], 12: [121, 129] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [112, 119], 12: [121, 129] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [21, 22], 12: [23, 24] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [21, 22], 12: [23, 24] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [21, 22], 12: [23, 24] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [21, 22], 12: [23, 24] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [21, 22], 12: [23, 24] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [288, 294], 12: [300, 315] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [285, 294], 12: [300, 315] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [2.6, 2.7], 12: [2.8, 3] },
          },
          {
            key: "block_mul",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [1.6, 1.7], 12: [1.7, 1.9] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 11: [299, 305], 12: [311, 327] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.3, -1.4], 12: [-1.5, -1.6] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [112, 119], 12: [121, 129] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [112, 119], 12: [121, 129] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [112, 119], 12: [121, 129] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [112, 119], 12: [121, 129] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [112, 119], 12: [121, 129] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [21, 22], 12: [23, 24] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [21, 22], 12: [23, 24] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [21, 22], 12: [23, 24] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [21, 22], 12: [23, 24] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [21, 22], 12: [23, 24] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [288, 294], 12: [300, 315] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [285, 294], 12: [300, 315] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [2.6, 2.7], 12: [2.8, 3] },
          },
          {
            key: "dodge_mul",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.1, 2.2], 12: [2.2, 2.4] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 11: [299, 305], 12: [311, 327] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.3, -1.4], 12: [-1.5, -1.6] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [56, 60], 12: [61, 65] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [56, 60], 12: [61, 65] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [56, 60], 12: [61, 65] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [56, 60], 12: [61, 65] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [56, 60], 12: [61, 65] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [12, 12], 12: [13, 13] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [12, 12], 12: [13, 13] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [12, 12], 12: [13, 13] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [12, 12], 12: [13, 13] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [12, 12], 12: [13, 13] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [142, 148], 12: [151, 158] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [142, 148], 12: [151, 158] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [1.3, 1.4], 12: [1.4, 1.5] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 11: [1, 1.1], 12: [1.1, 1.2] },
          },
          {
            key: "move_speed_mul",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.3] },
          },
          {
            key: "battle_resist",
            label: "Тактическая подготовка",
            isPercent: false,
            ranges: { 11: [144, 148], 12: [152, 160] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [115, 118], 12: [121, 127] },
          },
          {
            key: "backattack_melee_damage_mul",
            label: "Урон в ближнем бою со спины",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
          {
            key: "backattack_ranged_damage_mul",
            label: "Урон в дальнем бою со спины",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
          {
            key: "backattack_spell_damage_mul",
            label: "Урон заклинаниями со спины",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [56, 60], 12: [61, 65] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [56, 60], 12: [61, 65] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [56, 60], 12: [61, 65] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [56, 60], 12: [61, 65] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [56, 60], 12: [61, 65] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [12, 12], 12: [13, 13] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [12, 12], 12: [13, 13] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [12, 12], 12: [13, 13] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [12, 12], 12: [13, 13] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [12, 12], 12: [13, 13] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [142, 148], 12: [151, 158] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [142, 148], 12: [151, 158] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [1.3, 1.4], 12: [1.4, 1.5] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 11: [1, 1.1], 12: [1.1, 1.2] },
          },
          {
            key: "move_speed_mul",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.3] },
          },
          {
            key: "battle_resist",
            label: "Тактическая подготовка",
            isPercent: false,
            ranges: { 11: [144, 148], 12: [152, 160] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [115, 118], 12: [121, 127] },
          },
          {
            key: "backattack_melee_damage_mul",
            label: "Урон в ближнем бою со спины",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
          {
            key: "backattack_ranged_damage_mul",
            label: "Урон в дальнем бою со спины",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
          {
            key: "backattack_spell_damage_mul",
            label: "Урон заклинаниями со спины",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "attack_speed_mul",
            label: "Сноровка",
            isPercent: false,
            ranges: { 11: [58, 59], 12: [60, 63] },
          },
          {
            key: "casting_time_mul",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3.7, -3.8], 12: [-3.9, -4.1] },
          },
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] },
          },
          {
            key: "melee_critical_bonus",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 19] },
          },
          {
            key: "ranged_critical_bonus",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 19] },
          },
          {
            key: "spell_critical_bonus",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 19] },
          },
          {
            key: "heal_critical_bonus",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 19] },
          },
          {
            key: "ignore_armor",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [691, 705], 12: [719, 755] },
          },
          {
            key: "magic_penetration",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [691, 705], 12: [719, 755] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [223, 235], 12: [239, 257] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [223, 235], 12: [239, 257] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [223, 235], 12: [239, 257] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [223, 235], 12: [239, 257] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [223, 235], 12: [239, 257] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [41, 45], 12: [45, 48] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [41, 45], 12: [45, 48] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [41, 45], 12: [45, 48] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [41, 45], 12: [45, 48] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [41, 45], 12: [45, 48] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "attack_speed_mul",
            label: "Сноровка",
            isPercent: false,
            ranges: { 11: [104, 106], 12: [108, 113] },
          },
          {
            key: "casting_time_mul",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-6.7, -6.9], 12: [-7.1, -7.4] },
          },
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] },
          },
          {
            key: "melee_critical_bonus",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] },
          },
          {
            key: "ranged_critical_bonus",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] },
          },
          {
            key: "spell_critical_bonus",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] },
          },
          {
            key: "heal_critical_bonus",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] },
          },
          {
            key: "ignore_armor",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [1243, 1269], 12: [1294, 1359] },
          },
          {
            key: "magic_penetration",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [1243, 1269], 12: [1294, 1359] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "ignore_armor",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [590, 601], 12: [612, 643] },
          },
          {
            key: "magic_penetration",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [588, 601], 12: [615, 646] },
          },
          {
            key: "persistent_health_regen",
            label: "Восстановление здоровья в бою",
            isPercent: false,
            ranges: { 11: [6, 6], 12: [6, 7] },
          },
          {
            key: "persistent_mana_regen",
            label: "Восстановление маны в бою",
            isPercent: false,
            ranges: { 11: [6, 6], 12: [6, 7] },
          },
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [5.3, 5.5], 12: [5.6, 5.9] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [5.3, 5.5], 12: [5.6, 5.9] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 11: [5.3, 5.5], 12: [5.6, 5.9] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [5.3, 5.5], 12: [5.6, 5.9] },
          },
          {
            key: "melee_critical_bonus",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.7, 16.5] },
          },
          {
            key: "ranged_critical_bonus",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.7, 16.5] },
          },
          {
            key: "spell_critical_bonus",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.7, 16.5] },
          },
          {
            key: "heal_critical_bonus",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.8, 16.6] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [124, 131], 12: [133, 143] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [23, 25], 12: [25, 27] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "melee_dps_inc",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "ranged_dps_inc",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "spell_dps_inc",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "heal_dps_inc",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "block_mul",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.8] },
          },
          {
            key: "dodge_mul",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.3, 2.4], 12: [2.5, 2.6] },
          },
          {
            key: "move_speed_mul",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.3] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 11: [4.6, 4.7], 12: [4.8, 5] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [176, 188], 12: [188, 199] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [176, 188], 12: [188, 199] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [176, 188], 12: [188, 199] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [176, 188], 12: [188, 199] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [176, 188], 12: [188, 199] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [32, 34], 12: [34, 36] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [32, 34], 12: [34, 36] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [32, 34], 12: [34, 36] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [32, 34], 12: [34, 36] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [32, 34], 12: [34, 36] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [455, 465], 12: [468, 491] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [452, 464], 12: [468, 491] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [4.2, 4.4], 12: [4.5, 4.7] },
          },
          {
            key: "dodge_mul",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [3, 3.1], 12: [3.1, 3.3] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 11: [468, 478], 12: [480, 503] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.2, -2.3], 12: [-2.5, -2.6] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.2, -2.3], 12: [-2.5, -2.6] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.9, -1.9], 12: [-2, -2.1] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [294, 312], 12: [312, 332] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [294, 312], 12: [312, 332] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [294, 312], 12: [312, 332] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [294, 312], 12: [312, 332] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [294, 312], 12: [312, 332] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [53, 57], 12: [57, 61] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [53, 57], 12: [57, 61] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [53, 57], 12: [57, 61] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [53, 57], 12: [57, 61] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [53, 57], 12: [57, 61] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [759, 774], 12: [777, 815] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [754, 773], 12: [778, 819] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [7.1, 7.2], 12: [7.3, 7.8] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 11: [4.3, 4.5], 12: [4.5, 4.7] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 11: [781, 797], 12: [801, 840] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [-3.8, -3.9], 12: [-3.9, -4.1] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [-3.8, -3.9], 12: [-3.9, -4.1] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 11: [-3, -3.1], 12: [-3.2, -3.4] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [235, 249], 12: [249, 267] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [235, 249], 12: [249, 267] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [235, 249], 12: [249, 267] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [235, 249], 12: [249, 267] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [235, 249], 12: [249, 267] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [43, 45], 12: [46, 48] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [43, 45], 12: [46, 48] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [43, 45], 12: [46, 48] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [43, 45], 12: [46, 48] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [43, 45], 12: [46, 48] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [607, 619], 12: [621, 652] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [603, 619], 12: [622, 656] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [5.6, 5.8], 12: [5.8, 6.1] },
          },
          {
            key: "block_mul",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [3.3, 3.4], 12: [3.4, 3.6] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 11: [625, 637], 12: [640, 672] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [-3, -3.1], 12: [-3.1, -3.2] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [-3, -3.1], 12: [-3.1, -3.2] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.5, -2.6], 12: [-2.6, -2.7] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [118, 125], 12: [126, 134] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [118, 125], 12: [126, 134] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [118, 125], 12: [126, 134] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [118, 125], 12: [126, 134] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [118, 125], 12: [126, 134] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [22, 23], 12: [24, 25] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [22, 23], 12: [24, 25] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [22, 23], 12: [24, 25] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [22, 23], 12: [24, 25] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [22, 23], 12: [24, 25] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [304, 310], 12: [312, 327] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [300, 310], 12: [312, 327] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [2.7, 2.8], 12: [2.9, 3.1] },
          },
          {
            key: "block_mul",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [1.7, 1.8], 12: [1.8, 2] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 11: [312, 318], 12: [320, 336] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.7, -1.8], 12: [-1.9, -2] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.7, -1.8], 12: [-1.9, -2] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.4, -1.5], 12: [-1.5, -1.6] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [118, 125], 12: [126, 134] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [118, 125], 12: [126, 134] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [118, 125], 12: [126, 134] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [118, 125], 12: [126, 134] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [118, 125], 12: [126, 134] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [22, 23], 12: [24, 25] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [22, 23], 12: [24, 25] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [22, 23], 12: [24, 25] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [22, 23], 12: [24, 25] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [22, 23], 12: [24, 25] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [304, 310], 12: [312, 327] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [300, 310], 12: [312, 327] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [2.7, 2.8], 12: [2.9, 3.1] },
          },
          {
            key: "dodge_mul",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.2, 2.3], 12: [2.3, 2.5] },
          },
          {
            key: "flexibility",
            label: "Устойчивость к критическому урону",
            isPercent: false,
            ranges: { 11: [312, 318], 12: [320, 336] },
          },
          {
            key: "incoming_melee_damage_mul",
            label: "Получаемый урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.7, -1.8], 12: [-1.9, -2] },
          },
          {
            key: "incoming_ranged_damage_mul",
            label: "Получаемый урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.7, -1.8], 12: [-1.9, -2] },
          },
          {
            key: "incoming_spell_damage_mul",
            label: "Получаемый урон от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.4, -1.5], 12: [-1.5, -1.6] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [59, 63], 12: [63, 68] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [59, 63], 12: [63, 68] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [59, 63], 12: [63, 68] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [59, 63], 12: [63, 68] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [59, 63], 12: [63, 68] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [13, 13], 12: [14, 14] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [13, 13], 12: [14, 14] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [13, 13], 12: [14, 14] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [13, 13], 12: [14, 14] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [13, 13], 12: [14, 14] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [150, 156], 12: [157, 164] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [150, 156], 12: [157, 164] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [1.4, 1.5], 12: [1.5, 1.6] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 11: [1.1, 1.2], 12: [1.2, 1.3] },
          },
          {
            key: "move_speed_mul",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [3.1, 3.2], 12: [3.2, 3.4] },
          },
          {
            key: "battle_resist",
            label: "Тактическая подготовка",
            isPercent: false,
            ranges: { 11: [150, 154], 12: [156, 164] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [120, 123], 12: [124, 130] },
          },
          {
            key: "backattack_melee_damage_mul",
            label: "Урон в ближнем бою со спины",
            isPercent: true,
            ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] },
          },
          {
            key: "backattack_ranged_damage_mul",
            label: "Урон в дальнем бою со спины",
            isPercent: true,
            ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] },
          },
          {
            key: "backattack_spell_damage_mul",
            label: "Урон заклинаниями со спины",
            isPercent: true,
            ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [59, 63], 12: [63, 68] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [59, 63], 12: [63, 68] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [59, 63], 12: [63, 68] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [59, 63], 12: [63, 68] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [59, 63], 12: [63, 68] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [13, 13], 12: [14, 14] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [13, 13], 12: [14, 14] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [13, 13], 12: [14, 14] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [13, 13], 12: [14, 14] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [13, 13], 12: [14, 14] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "max_health",
            label: "Здоровье",
            isPercent: false,
            ranges: { 11: [150, 156], 12: [157, 164] },
          },
          {
            key: "max_mana",
            label: "Мана",
            isPercent: false,
            ranges: { 11: [150, 156], 12: [157, 164] },
          },
          {
            key: "incoming_heal_mul",
            label: "Восприимчивость к исцелению",
            isPercent: true,
            ranges: { 11: [1.4, 1.5], 12: [1.5, 1.6] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 11: [1.1, 1.2], 12: [1.2, 1.3] },
          },
          {
            key: "move_speed_mul",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [3.1, 3.2], 12: [3.2, 3.4] },
          },
          {
            key: "battle_resist",
            label: "Тактическая подготовка",
            isPercent: false,
            ranges: { 11: [150, 154], 12: [156, 164] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [120, 123], 12: [124, 130] },
          },
          {
            key: "backattack_melee_damage_mul",
            label: "Урон в ближнем бою со спины",
            isPercent: true,
            ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] },
          },
          {
            key: "backattack_ranged_damage_mul",
            label: "Урон в дальнем бою со спины",
            isPercent: true,
            ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] },
          },
          {
            key: "backattack_spell_damage_mul",
            label: "Урон заклинаниями со спины",
            isPercent: true,
            ranges: { 11: [3.8, 3.9], 12: [3.9, 4.2] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "attack_speed_mul",
            label: "Сноровка",
            isPercent: false,
            ranges: { 11: [61, 62], 12: [62, 65] },
          },
          {
            key: "casting_time_mul",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3.9, -4], 12: [-4.1, -4.3] },
          },
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [6.4, 6.5], 12: [6.5, 6.8] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [6.4, 6.5], 12: [6.5, 6.8] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 11: [6.4, 6.5], 12: [6.5, 6.8] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [6.4, 6.5], 12: [6.5, 6.8] },
          },
          {
            key: "melee_critical_bonus",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [18.1, 18.5], 12: [18.6, 19.5] },
          },
          {
            key: "ranged_critical_bonus",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [18.1, 18.5], 12: [18.6, 19.5] },
          },
          {
            key: "spell_critical_bonus",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [18.1, 18.5], 12: [18.6, 19.5] },
          },
          {
            key: "heal_critical_bonus",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [18.1, 18.5], 12: [18.6, 19.5] },
          },
          {
            key: "ignore_armor",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [720, 734], 12: [738, 775] },
          },
          {
            key: "magic_penetration",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [720, 734], 12: [738, 775] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [235, 248], 12: [248, 267] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [235, 248], 12: [248, 267] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [235, 248], 12: [248, 267] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [235, 248], 12: [248, 267] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [235, 248], 12: [248, 267] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [43, 47], 12: [47, 50] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [43, 47], 12: [47, 50] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [43, 47], 12: [47, 50] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [43, 47], 12: [47, 50] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [43, 47], 12: [47, 50] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "attack_speed_mul",
            label: "Сноровка",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [112, 117] },
          },
          {
            key: "casting_time_mul",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-7.1, -7.3], 12: [-7.4, -7.7] },
          },
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [11.4, 11.6], 12: [11.6, 12.1] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [11.4, 11.6], 12: [11.6, 12.1] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 11: [11.4, 11.6], 12: [11.6, 12.1] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [11.4, 11.6], 12: [11.6, 12.1] },
          },
          {
            key: "melee_critical_bonus",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [32.5, 33.2], 12: [33.4, 35.2] },
          },
          {
            key: "ranged_critical_bonus",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [32.5, 33.2], 12: [33.4, 35.2] },
          },
          {
            key: "spell_critical_bonus",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [32.5, 33.2], 12: [33.4, 35.2] },
          },
          {
            key: "heal_critical_bonus",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [32.5, 33.2], 12: [33.4, 35.2] },
          },
          {
            key: "ignore_armor",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [1295, 1322], 12: [1328, 1394] },
          },
          {
            key: "magic_penetration",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [1295, 1322], 12: [1328, 1394] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "ignore_armor",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [615, 626], 12: [628, 660] },
          },
          {
            key: "magic_penetration",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [612, 626], 12: [631, 663] },
          },
          {
            key: "persistent_health_regen",
            label: "Восстановление здоровья в бою",
            isPercent: false,
            ranges: { 11: [6, 7], 12: [7, 7] },
          },
          {
            key: "persistent_mana_regen",
            label: "Восстановление маны в бою",
            isPercent: false,
            ranges: { 11: [6, 7], 12: [7, 7] },
          },
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [5.5, 5.7], 12: [5.8, 6.1] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [5.5, 5.7], 12: [5.8, 6.1] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 11: [5.5, 5.7], 12: [5.8, 6.1] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [5.5, 5.7], 12: [5.8, 6.1] },
          },
          {
            key: "melee_critical_bonus",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [15.8, 16.1], 12: [16.1, 17] },
          },
          {
            key: "ranged_critical_bonus",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [15.8, 16.1], 12: [16.1, 17] },
          },
          {
            key: "spell_critical_bonus",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [15.8, 16.1], 12: [16.1, 17] },
          },
          {
            key: "heal_critical_bonus",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [15.8, 16.1], 12: [16.1, 17] },
          },
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
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [131, 138], 12: [138, 149] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [24, 26], 12: [26, 28] },
          },
        ],
      },
      {
        pickCount: 2,
        options: [
          {
            key: "melee_dps_inc",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [22.5, 22.9], 12: [23, 24.1] },
          },
          {
            key: "ranged_dps_inc",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [22.5, 22.9], 12: [23, 24.1] },
          },
          {
            key: "spell_dps_inc",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [22.5, 22.9], 12: [23, 24.1] },
          },
          {
            key: "heal_dps_inc",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [22.5, 22.9], 12: [23, 24.1] },
          },
          {
            key: "block_mul",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.7, 3.9] },
          },
          {
            key: "dodge_mul",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.4, 2.5], 12: [2.6, 2.7] },
          },
          {
            key: "move_speed_mul",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [3.1, 3.2], 12: [3.2, 3.4] },
          },
          {
            key: "melee_parry_mul",
            label: "Парирование атак ближнего боя",
            isPercent: true,
            ranges: { 11: [4.9, 5], 12: [5, 5.2] },
          },
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
          {
            key: "melee_critical_mul",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 12: [6.9, 7.2] },
          },
          {
            key: "ranged_critical_mul",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 12: [6.9, 7.2] },
          },
          {
            key: "spell_critical_mul",
            label: "Шанс критического удара заклинанием",
            isPercent: true,
            ranges: { 12: [6.9, 7.2] },
          },
          {
            key: "heal_critical_mul",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 12: [6.9, 7.2] },
          },
          {
            key: "melee_skill_dmg",
            label: "Доп. урон умений ближнего боя",
            isPercent: true,
            ranges: { 12: [4.5, 4.7] },
          },
          {
            key: "ranged_skill_dmg",
            label: "Доп. урон умений дальнего боя",
            isPercent: true,
            ranges: { 12: [4.5, 4.7] },
          },
          {
            key: "spell_skill_dmg",
            label: "Доп. урон умений заклинателя",
            isPercent: true,
            ranges: { 12: [4.5, 4.7] },
          },
          {
            key: "skill_time_mul",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 12: [-4.2, -4.4] },
          },
          {
            key: "proficiency",
            label: "Сноровка",
            isPercent: false,
            ranges: { 12: [65, 68] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 12: [760, 797] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 12: [760, 797] },
          },
          {
            key: "heal_effectiveness_bonus",
            label: "Доп. эффективность умений целителя",
            isPercent: true,
            ranges: { 12: [4.5, 4.7] },
          },
        ],
      },
      {
        pickCount: 1,
        options: [
          {
            key: "melee_skill_dmg_pvp",
            label: "Дополнительный урон умений ближнего боя в PvP",
            isPercent: true,
            ranges: { 12: [0.1, 0.5] },
          },
          {
            key: "ranged_skill_dmg_pvp",
            label: "Дополнительный урон умений дальнего боя в PvP",
            isPercent: true,
            ranges: { 12: [0.1, 0.5] },
          },
          {
            key: "spell_skill_dmg_pvp",
            label: "Дополнительный урон умений заклинателя в PvP",
            isPercent: true,
            ranges: { 12: [0.1, 0.5] },
          },
          {
            key: "melee_skill_dmg_pve",
            label: "Доп. урон умений ближнего боя в PvE",
            isPercent: true,
            ranges: { 12: [0.5, 1.0] },
          },
          {
            key: "ranged_skill_dmg_pve",
            label: "Доп. урон умений дальнего боя в PvE",
            isPercent: true,
            ranges: { 12: [0.5, 1.0] },
          },
          {
            key: "spell_skill_dmg_pve",
            label: "Доп. урон умений заклинателя в PvE",
            isPercent: true,
            ranges: { 12: [0.5, 1.0] },
          },
          {
            key: "heal_skill_dmg_pve",
            label: "Урон исцеляющими умениями в PvE",
            isPercent: true,
            ranges: { 12: [0.5, 1.0] },
          },
        ],
      },
    ],
  },

  // ===== Рамианская линейка (ancient_stats/ancient_bonus/ancient_bonus_PvE из БД) =====
  ramian_armor_head_18_03_500: {
    id: 500,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [300, 300], 12: [300, 300] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [312, 312], 12: [312, 312] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.5, -1.5], 12: [-1.5, -1.5] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.5, -1.5], 12: [-1.5, -1.5] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.2, -1.2], 12: [-1.2, -1.2] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [3, 3], 12: [3, 3] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.3, -1.3], 12: [-1.3, -1.3] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [97, 97], 12: [97, 97] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [97, 97], 12: [97, 97] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [97, 97], 12: [97, 97] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [97, 97], 12: [97, 97] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [97, 97], 12: [97, 97] },
          },
        ],
      },
    ],
  },
  ramian_armor_head_18_05_513: {
    id: 513,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [360, 360], 12: [360, 360] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [374, 374], 12: [374, 374] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.8, -1.8], 12: [-1.8, -1.8] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.8, -1.8], 12: [-1.8, -1.8] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.5, -1.5], 12: [-1.5, -1.5] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [3.6, 3.6], 12: [3.6, 3.6] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.6, -1.6], 12: [-1.6, -1.6] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [122, 122], 12: [122, 122] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [122, 122], 12: [122, 122] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [122, 122], 12: [122, 122] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [122, 122], 12: [122, 122] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [122, 122], 12: [122, 122] },
          },
        ],
      },
    ],
  },
  ramian_armor_head_18_07_529: {
    id: 529,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [432, 432], 12: [432, 432] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [449, 449], 12: [449, 449] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.1, -2.1], 12: [-2.1, -2.1] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.1, -2.1], 12: [-2.1, -2.1] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.8, -1.8], 12: [-1.8, -1.8] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [4.3, 4.3], 12: [4.3, 4.3] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.9, -1.9], 12: [-1.9, -1.9] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [148, 148], 12: [148, 148] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [148, 148], 12: [148, 148] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [148, 148], 12: [148, 148] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [148, 148], 12: [148, 148] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [148, 148], 12: [148, 148] },
          },
        ],
      },
    ],
  },
  ramian_armor_head_19_01_611: {
    id: 611,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [432, 441], 12: [450, 450] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [449, 458], 12: [467, 467] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.1, -2.2], 12: [-2.4, -2.4] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.1, -2.2], 12: [-2.4, -2.4] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.8, -1.8], 12: [-1.9, -1.9] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [4.3, 4.4], 12: [4.5, 4.5] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.9, -2], 12: [-2.1, -2.1] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [148, 152], 12: [156, 156] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [148, 152], 12: [156, 156] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [148, 152], 12: [156, 156] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [148, 152], 12: [156, 156] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [148, 152], 12: [156, 156] },
          },
        ],
      },
    ],
  },
  ramian_armor_head_19_12_704: {
    id: 704,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [432, 441], 12: [450, 473] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [449, 458], 12: [467, 490] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.1, -2.2], 12: [-2.4, -2.5] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.1, -2.2], 12: [-2.4, -2.5] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.8, -1.8], 12: [-1.9, -2] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [4.3, 4.4], 12: [4.5, 4.7] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.9, -2], 12: [-2.1, -2.2] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [148, 152], 12: [156, 164] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [148, 152], 12: [156, 164] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [148, 152], 12: [156, 164] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [148, 152], 12: [156, 164] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [148, 152], 12: [156, 164] },
          },
        ],
      },
    ],
  },
  ramian_armor_head_22_12_831: {
    id: 831,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [149, 153], 12: [156, 167] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [149, 153], 12: [156, 167] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [149, 153], 12: [156, 167] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [149, 153], 12: [156, 167] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [149, 153], 12: [156, 167] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "dmg_reduction_melee_pve",
            label: "Снижение урона от монстров в ближнем бою",
            isPercent: true,
            ranges: { 11: [-0.4, -1.4], 12: [-1.5, -3.9] },
          },
          {
            key: "dmg_reduction_ranged_pve",
            label: "Снижение урона от монстров в дальнем бою",
            isPercent: true,
            ranges: { 11: [-0.4, -1.4], 12: [-1.5, -3.9] },
          },
          {
            key: "dmg_reduction_spell_pve",
            label: "Снижение урона от монстров-заклинателей",
            isPercent: true,
            ranges: { 11: [-0.4, -1.4], 12: [-1.5, -3.9] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [434, 444], 12: [451, 482] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [450, 460], 12: [467, 498] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.1, -2.2], 12: [-2.4, -2.6] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.1, -2.2], 12: [-2.4, -2.6] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.8, -1.8], 12: [-1.9, -2.1] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [4.3, 4.4], 12: [4.5, 4.8] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.9, -2], 12: [-2.1, -2.3] },
          },
        ],
      },
    ],
  },
  ramian_armor_chest_18_03_501: {
    id: 501,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [500, 500], 12: [500, 500] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [520, 520], 12: [520, 520] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.5, -2.5], 12: [-2.5, -2.5] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.5, -2.5], 12: [-2.5, -2.5] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-2, -2], 12: [-2, -2] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [5, 5], 12: [5, 5] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-2.2, -2.2], 12: [-2.2, -2.2] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [162, 162], 12: [162, 162] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [162, 162], 12: [162, 162] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [162, 162], 12: [162, 162] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [162, 162], 12: [162, 162] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [162, 162], 12: [162, 162] },
          },
        ],
      },
    ],
  },
  ramian_armor_chest_18_05_514: {
    id: 514,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [600, 600], 12: [600, 600] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [624, 624], 12: [624, 624] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-3, -3], 12: [-3, -3] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-3, -3], 12: [-3, -3] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.5, -2.5], 12: [-2.5, -2.5] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [6, 6], 12: [6, 6] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-2.7, -2.7], 12: [-2.7, -2.7] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [203, 203], 12: [203, 203] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [203, 203], 12: [203, 203] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [203, 203], 12: [203, 203] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [203, 203], 12: [203, 203] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [203, 203], 12: [203, 203] },
          },
        ],
      },
    ],
  },
  ramian_armor_chest_18_07_530: {
    id: 530,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [720, 720], 12: [720, 720] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [749, 749], 12: [749, 749] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-3.6, -3.6], 12: [-3.6, -3.6] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-3.6, -3.6], 12: [-3.6, -3.6] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.9, -2.9], 12: [-2.9, -2.9] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [7.2, 7.2], 12: [7.2, 7.2] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-3.2, -3.2], 12: [-3.2, -3.2] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [247, 247], 12: [247, 247] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [247, 247], 12: [247, 247] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [247, 247], 12: [247, 247] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [247, 247], 12: [247, 247] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [247, 247], 12: [247, 247] },
          },
        ],
      },
    ],
  },
  ramian_armor_chest_19_01_612: {
    id: 612,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [720, 734], 12: [748, 748] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [749, 764], 12: [779, 779] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-3.6, -3.7], 12: [-3.8, -3.8] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-3.6, -3.7], 12: [-3.8, -3.8] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3.1, -3.1] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [7.2, 7.3], 12: [7.4, 7.4] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-3.2, -3.3], 12: [-3.4, -3.4] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [247, 252], 12: [257, 257] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [247, 252], 12: [257, 257] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [247, 252], 12: [257, 257] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [247, 252], 12: [257, 257] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [247, 252], 12: [257, 257] },
          },
        ],
      },
    ],
  },
  ramian_armor_chest_19_12_705: {
    id: 705,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [720, 734], 12: [748, 785] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [749, 764], 12: [779, 818] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-3.6, -3.7], 12: [-3.8, -4] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-3.6, -3.7], 12: [-3.8, -4] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3.1, -3.3] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [7.2, 7.3], 12: [7.4, 7.8] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-3.2, -3.3], 12: [-3.4, -3.6] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [247, 252], 12: [257, 270] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [247, 252], 12: [257, 270] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [247, 252], 12: [257, 270] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [247, 252], 12: [257, 270] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [247, 252], 12: [257, 270] },
          },
        ],
      },
    ],
  },
  ramian_armor_chest_22_12_832: {
    id: 832,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [248, 254], 12: [258, 275] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [248, 254], 12: [258, 275] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [248, 254], 12: [258, 275] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [248, 254], 12: [258, 275] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [248, 254], 12: [258, 275] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "dmg_reduction_melee_pve",
            label: "Снижение урона от монстров в ближнем бою",
            isPercent: true,
            ranges: { 11: [-0.5, -1.8], 12: [-1.9, -5.2] },
          },
          {
            key: "dmg_reduction_ranged_pve",
            label: "Снижение урона от монстров в дальнем бою",
            isPercent: true,
            ranges: { 11: [-0.5, -1.8], 12: [-1.9, -5.2] },
          },
          {
            key: "dmg_reduction_spell_pve",
            label: "Снижение урона от монстров-заклинателей",
            isPercent: true,
            ranges: { 11: [-0.5, -1.8], 12: [-1.9, -5.2] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [724, 738], 12: [750, 799] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [751, 767], 12: [779, 831] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-3.7, -3.8], 12: [-3.8, -4.1] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-3.7, -3.8], 12: [-3.8, -4.1] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3.1, -3.4] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [7.2, 7.3], 12: [7.4, 7.9] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-3.2, -3.4], 12: [-3.4, -3.7] },
          },
        ],
      },
    ],
  },
  ramian_armor_waist_18_03_506: {
    id: 506,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2, 2], 12: [2, 2] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [100, 100], 12: [100, 100] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [2.5, 2.5], 12: [2.5, 2.5] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [2.5, 2.5], 12: [2.5, 2.5] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [2.5, 2.5], 12: [2.5, 2.5] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [4, 4], 12: [4, 4] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [33, 33], 12: [33, 33] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [33, 33], 12: [33, 33] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [33, 33], 12: [33, 33] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [33, 33], 12: [33, 33] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [33, 33], 12: [33, 33] },
          },
        ],
      },
    ],
  },
  ramian_armor_waist_18_05_519: {
    id: 519,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.4, 2.4], 12: [2.4, 2.4] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [120, 120], 12: [120, 120] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [3, 3], 12: [3, 3] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [3, 3], 12: [3, 3] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [3, 3], 12: [3, 3] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [4.8, 4.8], 12: [4.8, 4.8] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [41, 41], 12: [41, 41] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [41, 41], 12: [41, 41] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [41, 41], 12: [41, 41] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [41, 41], 12: [41, 41] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [41, 41], 12: [41, 41] },
          },
        ],
      },
    ],
  },
  ramian_armor_waist_18_07_535: {
    id: 535,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 2.9], 12: [2.9, 2.9] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [144, 144], 12: [144, 144] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [115, 115], 12: [115, 115] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.6], 12: [3.6, 3.6] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.6], 12: [3.6, 3.6] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [3.6, 3.6], 12: [3.6, 3.6] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [5.8, 5.8], 12: [5.8, 5.8] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [49, 49], 12: [49, 49] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [49, 49], 12: [49, 49] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [49, 49], 12: [49, 49] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [49, 49], 12: [49, 49] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [49, 49], 12: [49, 49] },
          },
        ],
      },
    ],
  },
  ramian_armor_waist_19_01_617: {
    id: 617,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.1] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [144, 148], 12: [152, 152] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [115, 118], 12: [121, 121] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 3.8] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 3.8] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 3.8] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 51] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 51] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 51] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 51] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 51] },
          },
        ],
      },
    ],
  },
  ramian_armor_waist_19_12_710: {
    id: 710,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.3] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [144, 148], 12: [152, 160] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [115, 118], 12: [121, 127] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6.3] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 54] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 54] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 54] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 54] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 54] },
          },
        ],
      },
    ],
  },
  ramian_armor_waist_22_12_837: {
    id: 837,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 55] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 55] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 55] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 55] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 55] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "dmg_reduction_melee_pve",
            label: "Снижение урона от монстров в ближнем бою",
            isPercent: true,
            ranges: { 11: [-0.2, -0.8], 12: [-0.9, -2.3] },
          },
          {
            key: "dmg_reduction_ranged_pve",
            label: "Снижение урона от монстров в дальнем бою",
            isPercent: true,
            ranges: { 11: [-0.2, -0.8], 12: [-0.9, -2.3] },
          },
          {
            key: "dmg_reduction_spell_pve",
            label: "Снижение урона от монстров-заклинателей",
            isPercent: true,
            ranges: { 11: [-0.2, -0.8], 12: [-0.9, -2.3] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.4] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [144, 148], 12: [152, 162] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [116, 119], 12: [121, 129] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4.1] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4.1] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4.1] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6.4] },
          },
        ],
      },
    ],
  },
  ramian_armor_arms_18_03_505: {
    id: 505,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2, 2], 12: [2, 2] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [100, 100], 12: [100, 100] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [2.5, 2.5], 12: [2.5, 2.5] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [2.5, 2.5], 12: [2.5, 2.5] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [2.5, 2.5], 12: [2.5, 2.5] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [4, 4], 12: [4, 4] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [33, 33], 12: [33, 33] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [33, 33], 12: [33, 33] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [33, 33], 12: [33, 33] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [33, 33], 12: [33, 33] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [33, 33], 12: [33, 33] },
          },
        ],
      },
    ],
  },
  ramian_armor_arms_18_05_518: {
    id: 518,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.4, 2.4], 12: [2.4, 2.4] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [120, 120], 12: [120, 120] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [3, 3], 12: [3, 3] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [3, 3], 12: [3, 3] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [3, 3], 12: [3, 3] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [4.8, 4.8], 12: [4.8, 4.8] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [41, 41], 12: [41, 41] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [41, 41], 12: [41, 41] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [41, 41], 12: [41, 41] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [41, 41], 12: [41, 41] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [41, 41], 12: [41, 41] },
          },
        ],
      },
    ],
  },
  ramian_armor_arms_18_07_534: {
    id: 534,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 2.9], 12: [2.9, 2.9] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [144, 144], 12: [144, 144] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [115, 115], 12: [115, 115] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.6], 12: [3.6, 3.6] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.6], 12: [3.6, 3.6] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [3.6, 3.6], 12: [3.6, 3.6] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [5.8, 5.8], 12: [5.8, 5.8] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [49, 49], 12: [49, 49] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [49, 49], 12: [49, 49] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [49, 49], 12: [49, 49] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [49, 49], 12: [49, 49] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [49, 49], 12: [49, 49] },
          },
        ],
      },
    ],
  },
  ramian_armor_arms_19_01_616: {
    id: 616,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.1] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [144, 148], 12: [152, 152] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [115, 118], 12: [121, 121] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 3.8] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 3.8] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 3.8] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 51] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 51] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 51] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 51] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 51] },
          },
        ],
      },
    ],
  },
  ramian_armor_arms_19_12_709: {
    id: 709,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.3] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [144, 148], 12: [152, 160] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [115, 118], 12: [121, 127] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6.3] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 54] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 54] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 54] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 54] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 54] },
          },
        ],
      },
    ],
  },
  ramian_armor_arms_22_12_836: {
    id: 836,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 55] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 55] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 55] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 55] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [49, 50], 12: [51, 55] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "dmg_reduction_melee_pve",
            label: "Снижение урона от монстров в ближнем бою",
            isPercent: true,
            ranges: { 11: [-0.2, -0.9], 12: [-1, -2.6] },
          },
          {
            key: "dmg_reduction_ranged_pve",
            label: "Снижение урона от монстров в дальнем бою",
            isPercent: true,
            ranges: { 11: [-0.2, -0.9], 12: [-1, -2.6] },
          },
          {
            key: "dmg_reduction_spell_pve",
            label: "Снижение урона от монстров-заклинателей",
            isPercent: true,
            ranges: { 11: [-0.2, -0.9], 12: [-1, -2.6] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.4] },
          },
          {
            key: "pvp_resist",
            label: "Устойчивость к атакам в PvP",
            isPercent: false,
            ranges: { 11: [144, 148], 12: [152, 162] },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: { 11: [116, 119], 12: [121, 129] },
          },
          {
            key: "backattack_melee",
            label: "Доп. урон со спины в ближнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4.1] },
          },
          {
            key: "backattack_ranged",
            label: "Доп. урон со спины в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4.1] },
          },
          {
            key: "backattack_spell",
            label: "Доп. урон со спины заклинаниями",
            isPercent: true,
            ranges: { 11: [3.6, 3.7], 12: [3.8, 4.1] },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6.4] },
          },
        ],
      },
    ],
  },
  ramian_armor_hands_18_03_503: {
    id: 503,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [200, 200], 12: [200, 200] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [208, 208], 12: [208, 208] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1, -1], 12: [-1, -1] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1, -1], 12: [-1, -1] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-0.8, -0.8], 12: [-0.8, -0.8] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2, 2], 12: [2, 2] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-0.9, -0.9], 12: [-0.9, -0.9] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [65, 65], 12: [65, 65] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [65, 65], 12: [65, 65] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [65, 65], 12: [65, 65] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [65, 65], 12: [65, 65] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [65, 65], 12: [65, 65] },
          },
        ],
      },
    ],
  },
  ramian_armor_hands_18_05_516: {
    id: 516,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [240, 240], 12: [240, 240] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [249, 249], 12: [249, 249] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.3, -1.3], 12: [-1.3, -1.3] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.3, -1.3], 12: [-1.3, -1.3] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1, -1], 12: [-1, -1] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2.4, 2.4], 12: [2.4, 2.4] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.1, -1.1], 12: [-1.1, -1.1] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [81, 81], 12: [81, 81] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [81, 81], 12: [81, 81] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [81, 81], 12: [81, 81] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [81, 81], 12: [81, 81] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [81, 81], 12: [81, 81] },
          },
        ],
      },
    ],
  },
  ramian_armor_hands_18_07_532: {
    id: 532,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [288, 288], 12: [288, 288] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [299, 299], 12: [299, 299] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.6], 12: [-1.6, -1.6] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.6], 12: [-1.6, -1.6] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.3, -1.3], 12: [-1.3, -1.3] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2.9, 2.9], 12: [2.9, 2.9] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.4, -1.4], 12: [-1.4, -1.4] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [99, 99], 12: [99, 99] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [99, 99], 12: [99, 99] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [99, 99], 12: [99, 99] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [99, 99], 12: [99, 99] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [99, 99], 12: [99, 99] },
          },
        ],
      },
    ],
  },
  ramian_armor_hands_19_01_614: {
    id: 614,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [288, 294], 12: [300, 300] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [299, 305], 12: [311, 311] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.8] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.8] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.3, -1.4], 12: [-1.5, -1.5] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.1] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.4, -1.5], 12: [-1.6, -1.6] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 103] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 103] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 103] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 103] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 103] },
          },
        ],
      },
    ],
  },
  ramian_armor_hands_19_12_707: {
    id: 707,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [288, 294], 12: [300, 315] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [299, 305], 12: [311, 327] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.3, -1.4], 12: [-1.5, -1.6] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.3] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.4, -1.5], 12: [-1.6, -1.7] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 108] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 108] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 108] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 108] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 108] },
          },
        ],
      },
    ],
  },
  ramian_armor_hands_22_12_834: {
    id: 834,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [99, 102], 12: [103, 110] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [99, 102], 12: [103, 110] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [99, 102], 12: [103, 110] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [99, 102], 12: [103, 110] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [99, 102], 12: [103, 110] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "dmg_reduction_melee_pve",
            label: "Снижение урона от монстров в ближнем бою",
            isPercent: true,
            ranges: { 11: [-0.3, -1.2], 12: [-1.3, -3.4] },
          },
          {
            key: "dmg_reduction_ranged_pve",
            label: "Снижение урона от монстров в дальнем бою",
            isPercent: true,
            ranges: { 11: [-0.3, -1.2], 12: [-1.3, -3.4] },
          },
          {
            key: "dmg_reduction_spell_pve",
            label: "Снижение урона от монстров-заклинателей",
            isPercent: true,
            ranges: { 11: [-0.3, -1.2], 12: [-1.3, -3.4] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [289, 296], 12: [301, 321] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [300, 306], 12: [311, 332] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -2] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -2] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.3, -1.4], 12: [-1.5, -1.6] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.4] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.4, -1.5], 12: [-1.6, -1.7] },
          },
        ],
      },
    ],
  },
  ramian_armor_legs_18_03_502: {
    id: 502,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [400, 400], 12: [400, 400] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [416, 416], 12: [416, 416] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2, -2], 12: [-2, -2] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2, -2], 12: [-2, -2] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.7, -1.7], 12: [-1.7, -1.7] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [4, 4], 12: [4, 4] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.8, -1.8], 12: [-1.8, -1.8] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [130, 130], 12: [130, 130] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [130, 130], 12: [130, 130] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [130, 130], 12: [130, 130] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [130, 130], 12: [130, 130] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [130, 130], 12: [130, 130] },
          },
        ],
      },
    ],
  },
  ramian_armor_legs_18_05_515: {
    id: 515,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [480, 480], 12: [480, 480] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [499, 499], 12: [499, 499] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.4, -2.4], 12: [-2.4, -2.4] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.4, -2.4], 12: [-2.4, -2.4] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.9, -1.9], 12: [-1.9, -1.9] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [4.8, 4.8], 12: [4.8, 4.8] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-2.1, -2.1], 12: [-2.1, -2.1] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [162, 162], 12: [162, 162] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [162, 162], 12: [162, 162] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [162, 162], 12: [162, 162] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [162, 162], 12: [162, 162] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [162, 162], 12: [162, 162] },
          },
        ],
      },
    ],
  },
  ramian_armor_legs_18_07_531: {
    id: 531,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [576, 576], 12: [576, 576] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [599, 599], 12: [599, 599] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.9, -2.9], 12: [-2.9, -2.9] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.9, -2.9], 12: [-2.9, -2.9] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.4, -2.4], 12: [-2.4, -2.4] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [5.8, 5.8], 12: [5.8, 5.8] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-2.6, -2.6], 12: [-2.6, -2.6] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [198, 198], 12: [198, 198] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [198, 198], 12: [198, 198] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [198, 198], 12: [198, 198] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [198, 198], 12: [198, 198] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [198, 198], 12: [198, 198] },
          },
        ],
      },
    ],
  },
  ramian_armor_legs_19_01_613: {
    id: 613,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [576, 587], 12: [598, 598] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [599, 611], 12: [623, 623] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3, -3] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3, -3] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.4, -2.5], 12: [-2.5, -2.5] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-2.6, -2.7], 12: [-2.7, -2.7] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [198, 202], 12: [206, 206] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [198, 202], 12: [206, 206] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [198, 202], 12: [206, 206] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [198, 202], 12: [206, 206] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [198, 202], 12: [206, 206] },
          },
        ],
      },
    ],
  },
  ramian_armor_legs_19_12_706: {
    id: 706,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [576, 587], 12: [598, 628] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [599, 611], 12: [623, 654] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3, -3.1] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3, -3.1] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.4, -2.5], 12: [-2.5, -2.6] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6.3] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-2.6, -2.7], 12: [-2.7, -2.8] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [198, 202], 12: [206, 216] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [198, 202], 12: [206, 216] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [198, 202], 12: [206, 216] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [198, 202], 12: [206, 216] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [198, 202], 12: [206, 216] },
          },
        ],
      },
    ],
  },
  ramian_armor_legs_22_12_833: {
    id: 833,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [199, 203], 12: [207, 220] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [199, 203], 12: [207, 220] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [199, 203], 12: [207, 220] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [199, 203], 12: [207, 220] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [199, 203], 12: [207, 220] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "dmg_reduction_melee_pve",
            label: "Снижение урона от монстров в ближнем бою",
            isPercent: true,
            ranges: { 11: [-0.5, -1.8], 12: [-1.9, -5.2] },
          },
          {
            key: "dmg_reduction_ranged_pve",
            label: "Снижение урона от монстров в дальнем бою",
            isPercent: true,
            ranges: { 11: [-0.5, -1.8], 12: [-1.9, -5.2] },
          },
          {
            key: "dmg_reduction_spell_pve",
            label: "Снижение урона от монстров-заклинателей",
            isPercent: true,
            ranges: { 11: [-0.5, -1.8], 12: [-1.9, -5.2] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [579, 591], 12: [599, 639] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [600, 613], 12: [623, 664] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3, -3.2] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-2.9, -3], 12: [-3, -3.2] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-2.4, -2.5], 12: [-2.5, -2.7] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6.4] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-2.6, -2.7], 12: [-2.7, -2.9] },
          },
        ],
      },
    ],
  },
  ramian_armor_feet_18_03_504: {
    id: 504,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [200, 200], 12: [200, 200] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [208, 208], 12: [208, 208] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1, -1], 12: [-1, -1] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1, -1], 12: [-1, -1] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-0.8, -0.8], 12: [-0.8, -0.8] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2, 2], 12: [2, 2] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-0.9, -0.9], 12: [-0.9, -0.9] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [65, 65], 12: [65, 65] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [65, 65], 12: [65, 65] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [65, 65], 12: [65, 65] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [65, 65], 12: [65, 65] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [65, 65], 12: [65, 65] },
          },
        ],
      },
    ],
  },
  ramian_armor_feet_18_05_517: {
    id: 517,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [240, 240], 12: [240, 240] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [249, 249], 12: [249, 249] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.3, -1.3], 12: [-1.3, -1.3] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.3, -1.3], 12: [-1.3, -1.3] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1, -1], 12: [-1, -1] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2.4, 2.4], 12: [2.4, 2.4] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.1, -1.1], 12: [-1.1, -1.1] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [81, 81], 12: [81, 81] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [81, 81], 12: [81, 81] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [81, 81], 12: [81, 81] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [81, 81], 12: [81, 81] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [81, 81], 12: [81, 81] },
          },
        ],
      },
    ],
  },
  ramian_armor_feet_18_07_533: {
    id: 533,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [288, 288], 12: [288, 288] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [299, 299], 12: [299, 299] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.6], 12: [-1.6, -1.6] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.6], 12: [-1.6, -1.6] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.3, -1.3], 12: [-1.3, -1.3] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2.9, 2.9], 12: [2.9, 2.9] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.4, -1.4], 12: [-1.4, -1.4] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [99, 99], 12: [99, 99] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [99, 99], 12: [99, 99] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [99, 99], 12: [99, 99] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [99, 99], 12: [99, 99] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [99, 99], 12: [99, 99] },
          },
        ],
      },
    ],
  },
  ramian_armor_feet_19_01_615: {
    id: 615,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [288, 294], 12: [300, 300] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [299, 305], 12: [311, 311] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.8] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.8] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.3, -1.4], 12: [-1.5, -1.5] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.1] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.4, -1.5], 12: [-1.6, -1.6] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 103] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 103] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 103] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 103] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 103] },
          },
        ],
      },
    ],
  },
  ramian_armor_feet_19_12_708: {
    id: 708,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [288, 294], 12: [300, 315] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [299, 305], 12: [311, 327] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -1.9] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.3, -1.4], 12: [-1.5, -1.6] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.3] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.4, -1.5], 12: [-1.6, -1.7] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 108] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 108] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 108] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 108] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [99, 101], 12: [103, 108] },
          },
        ],
      },
    ],
  },
  ramian_armor_feet_22_12_835: {
    id: 835,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [99, 102], 12: [103, 110] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [99, 102], 12: [103, 110] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [99, 102], 12: [103, 110] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [99, 102], 12: [103, 110] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [99, 102], 12: [103, 110] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "dmg_reduction_melee_pve",
            label: "Снижение урона от монстров в ближнем бою",
            isPercent: true,
            ranges: { 11: [-0.3, -1.2], 12: [-1.3, -3.4] },
          },
          {
            key: "dmg_reduction_ranged_pve",
            label: "Снижение урона от монстров в дальнем бою",
            isPercent: true,
            ranges: { 11: [-0.3, -1.2], 12: [-1.3, -3.4] },
          },
          {
            key: "dmg_reduction_spell_pve",
            label: "Снижение урона от монстров-заклинателей",
            isPercent: true,
            ranges: { 11: [-0.3, -1.2], 12: [-1.3, -3.4] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [289, 296], 12: [301, 321] },
          },
          {
            key: "crit_resist_ignore",
            label: "Игнорирование устойчивости к критическому урону",
            isPercent: false,
            ranges: { 11: [300, 306], 12: [311, 332] },
          },
          {
            key: "dmg_reduction_melee",
            label: "Снижение получаемого урона в ближнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -2] },
          },
          {
            key: "dmg_reduction_ranged",
            label: "Снижение получаемого урона в дальнем бою",
            isPercent: true,
            ranges: { 11: [-1.6, -1.7], 12: [-1.8, -2] },
          },
          {
            key: "dmg_reduction_spell",
            label: "Снижение получаемого урона от заклинаний",
            isPercent: true,
            ranges: { 11: [-1.3, -1.4], 12: [-1.5, -1.6] },
          },
          {
            key: "shield_block_penetration",
            label: "Пробивание блока",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.4] },
          },
          {
            key: "reinforced_armor",
            label: "Устойчивость к осадному урону",
            isPercent: true,
            ranges: { 11: [-1.4, -1.5], 12: [-1.6, -1.7] },
          },
        ],
      },
    ],
  },
  ramian_weapon_instrument_18_03_499: {
    id: 499,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [15, 15], 12: [15, 15] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [15, 15], 12: [15, 15] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [15, 15], 12: [15, 15] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [15, 15], 12: [15, 15] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [3.2, 3.2], 12: [3.2, 3.2] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [2.4, 2.4], 12: [2.4, 2.4] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [1.5, 1.5], 12: [1.5, 1.5] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2, 2], 12: [2, 2] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
        ],
      },
    ],
  },
  ramian_weapon_instrument_18_05_512: {
    id: 512,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [18, 18], 12: [18, 18] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [18, 18], 12: [18, 18] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [18, 18], 12: [18, 18] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [18, 18], 12: [18, 18] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [3.8, 3.8], 12: [3.8, 3.8] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [2.8, 2.8], 12: [2.8, 2.8] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [1.9, 1.9], 12: [1.9, 1.9] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.4, 2.4], 12: [2.4, 2.4] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
        ],
      },
    ],
  },
  ramian_weapon_instrument_18_07_528: {
    id: 528,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [4.6, 4.6], 12: [4.6, 4.6] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.4, 3.4], 12: [3.4, 3.4] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.3, 2.3], 12: [2.3, 2.3] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 2.9], 12: [2.9, 2.9] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
        ],
      },
    ],
  },
  ramian_weapon_instrument_19_01_610: {
    id: 610,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 22.4] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 22.4] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 22.4] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 22.4] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [4.6, 4.7], 12: [4.8, 4.8] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.6] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.3, 2.4], 12: [2.5, 2.5] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.1] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
        ],
      },
    ],
  },
  ramian_weapon_instrument_19_12_703: {
    id: 703,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [4.6, 4.7], 12: [4.8, 5] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.8] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.3, 2.4], 12: [2.5, 2.6] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.3] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
        ],
      },
    ],
  },
  ramian_weapon_instrument_22_12_830: {
    id: 830,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "skill_dmg_melee_pve",
            label: "Доп. урон умений ближнего боя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.2], 12: [0.3, 0.5] },
          },
          {
            key: "skill_dmg_ranged_pve",
            label: "Доп. урон умений дальнего боя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.2], 12: [0.3, 0.5] },
          },
          {
            key: "skill_dmg_spell_pve",
            label: "Доп. урон умений заклинателя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.2], 12: [0.3, 0.5] },
          },
          {
            key: "heal_skill_dmg_pve",
            label: "Урон исцеляющими умениями по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.2], 12: [0.3, 0.5] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [21.7, 22.1], 12: [22.4, 23.9] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [21.7, 22.1], 12: [22.4, 23.9] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [21.7, 22.1], 12: [22.4, 23.9] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [21.7, 22.1], 12: [22.4, 23.9] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [4.6, 4.7], 12: [4.8, 5.1] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.9] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.3, 2.4], 12: [2.5, 2.6] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.4] },
          },
        ],
      },
    ],
  },
  ramian_weapon_twohanded_22_12_827: {
    id: 827,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [199, 202], 12: [206, 220] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [199, 202], 12: [206, 220] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [199, 202], 12: [206, 220] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [199, 202], 12: [206, 220] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [199, 202], 12: [206, 220] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "skill_dmg_melee_pve",
            label: "Доп. урон умений ближнего боя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.7], 12: [0.8, 1.9] },
          },
          {
            key: "skill_dmg_ranged_pve",
            label: "Доп. урон умений дальнего боя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.7], 12: [0.8, 1.9] },
          },
          {
            key: "skill_dmg_spell_pve",
            label: "Доп. урон умений заклинателя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.7], 12: [0.8, 1.9] },
          },
          {
            key: "heal_skill_dmg_pve",
            label: "Урон исцеляющими умениями по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.7], 12: [0.8, 1.9] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [11, 11.2], 12: [11.3, 12] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [11, 11.2], 12: [11.3, 12] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [11, 11.2], 12: [11.3, 12] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [11, 11.2], 12: [11.3, 12] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [31.3, 32], 12: [32.6, 34.8] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [31.3, 32], 12: [32.6, 34.8] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [31.3, 32], 12: [32.6, 34.8] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [31.3, 32], 12: [32.6, 34.8] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-6.7, -6.9], 12: [-7.1, -7.5] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [10.5, 10.7], 12: [10.8, 11.5] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [1247, 1274], 12: [1295, 1381] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [1247, 1274], 12: [1295, 1381] },
          },
        ],
      },
    ],
  },
  ramian_weapon_twohanded_19_12_700: {
    id: 700,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.8] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 34.2] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-6.7, -6.9], 12: [-7.1, -7.4] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [10.4, 10.6], 12: [10.8, 11.3] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [1243, 1269], 12: [1294, 1359] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [1243, 1269], 12: [1294, 1359] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [198, 201], 12: [205, 216] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [198, 201], 12: [205, 216] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [198, 201], 12: [205, 216] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [198, 201], 12: [205, 216] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [198, 201], 12: [205, 216] },
          },
        ],
      },
    ],
  },
  ramian_weapon_twohanded_19_01_607: {
    id: 607,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.3] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.3] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.3] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [10.9, 11.1], 12: [11.3, 11.3] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 32.5] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 32.5] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 32.5] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [31.1, 31.8], 12: [32.5, 32.5] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-6.7, -6.9], 12: [-7.1, -7.1] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [10.4, 10.6], 12: [10.8, 10.8] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [1243, 1269], 12: [1294, 1294] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [1243, 1269], 12: [1294, 1294] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [198, 201], 12: [205, 205] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [198, 201], 12: [205, 205] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [198, 201], 12: [205, 205] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [198, 201], 12: [205, 205] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [198, 201], 12: [205, 205] },
          },
        ],
      },
    ],
  },
  ramian_weapon_twohanded_18_07_525: {
    id: 525,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [10.9, 10.9], 12: [10.9, 10.9] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [10.9, 10.9], 12: [10.9, 10.9] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [10.9, 10.9], 12: [10.9, 10.9] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [10.9, 10.9], 12: [10.9, 10.9] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [31.1, 31.1], 12: [31.1, 31.1] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [31.1, 31.1], 12: [31.1, 31.1] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [31.1, 31.1], 12: [31.1, 31.1] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [31.1, 31.1], 12: [31.1, 31.1] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-6.7, -6.7], 12: [-6.7, -6.7] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [10.4, 10.4], 12: [10.4, 10.4] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [1243, 1243], 12: [1243, 1243] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [1243, 1243], 12: [1243, 1243] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [198, 198], 12: [198, 198] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [198, 198], 12: [198, 198] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [198, 198], 12: [198, 198] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [198, 198], 12: [198, 198] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [198, 198], 12: [198, 198] },
          },
        ],
      },
    ],
  },
  ramian_weapon_twohanded_18_05_509: {
    id: 509,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [9.1, 9.1], 12: [9.1, 9.1] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [9.1, 9.1], 12: [9.1, 9.1] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [9.1, 9.1], 12: [9.1, 9.1] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [9.1, 9.1], 12: [9.1, 9.1] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [25.9, 25.9], 12: [25.9, 25.9] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [25.9, 25.9], 12: [25.9, 25.9] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [25.9, 25.9], 12: [25.9, 25.9] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [25.9, 25.9], 12: [25.9, 25.9] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-5.6, -5.6], 12: [-5.6, -5.6] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [8.6, 8.6], 12: [8.6, 8.6] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [1036, 1036], 12: [1036, 1036] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [1036, 1036], 12: [1036, 1036] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [172, 172], 12: [172, 172] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [172, 172], 12: [172, 172] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [172, 172], 12: [172, 172] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [172, 172], 12: [172, 172] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [172, 172], 12: [172, 172] },
          },
        ],
      },
    ],
  },
  ramian_weapon_twohanded_18_03_496: {
    id: 496,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [7.7, 7.7], 12: [7.7, 7.7] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [7.7, 7.7], 12: [7.7, 7.7] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [7.7, 7.7], 12: [7.7, 7.7] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [7.7, 7.7], 12: [7.7, 7.7] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-4.7, -4.7], 12: [-4.7, -4.7] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [7.2, 7.2], 12: [7.2, 7.2] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [864, 864], 12: [864, 864] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [864, 864], 12: [864, 864] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [144, 144], 12: [144, 144] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [144, 144], 12: [144, 144] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [144, 144], 12: [144, 144] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [144, 144], 12: [144, 144] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [144, 144], 12: [144, 144] },
          },
        ],
      },
    ],
  },
  ramian_weapon_onehand_18_03_494: {
    id: 494,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [4.3, 4.3], 12: [4.3, 4.3] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [4.3, 4.3], 12: [4.3, 4.3] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [4.3, 4.3], 12: [4.3, 4.3] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [4.3, 4.3], 12: [4.3, 4.3] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [12, 12], 12: [12, 12] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [12, 12], 12: [12, 12] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [12, 12], 12: [12, 12] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [12, 12], 12: [12, 12] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-2.6, -2.6], 12: [-2.6, -2.6] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [4, 4], 12: [4, 4] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [480, 480], 12: [480, 480] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [480, 480], 12: [480, 480] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
        ],
      },
    ],
  },
  ramian_weapon_onehand_18_05_508: {
    id: 508,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [5.1, 5.1], 12: [5.1, 5.1] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [5.1, 5.1], 12: [5.1, 5.1] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [5.1, 5.1], 12: [5.1, 5.1] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [5.1, 5.1], 12: [5.1, 5.1] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [14.4, 14.4], 12: [14.4, 14.4] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [14.4, 14.4], 12: [14.4, 14.4] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [14.4, 14.4], 12: [14.4, 14.4] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [14.4, 14.4], 12: [14.4, 14.4] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3.1, -3.1], 12: [-3.1, -3.1] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [4.8, 4.8], 12: [4.8, 4.8] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [576, 576], 12: [576, 576] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [576, 576], 12: [576, 576] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
        ],
      },
    ],
  },
  ramian_weapon_onehand_18_07_524: {
    id: 524,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [6.1, 6.1], 12: [6.1, 6.1] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [6.1, 6.1], 12: [6.1, 6.1] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [6.1, 6.1], 12: [6.1, 6.1] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [6.1, 6.1], 12: [6.1, 6.1] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [17.3, 17.3], 12: [17.3, 17.3] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [17.3, 17.3], 12: [17.3, 17.3] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [17.3, 17.3], 12: [17.3, 17.3] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [17.3, 17.3], 12: [17.3, 17.3] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3.7, -3.7], 12: [-3.7, -3.7] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [5.8, 5.8], 12: [5.8, 5.8] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [691, 691], 12: [691, 691] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [691, 691], 12: [691, 691] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
        ],
      },
    ],
  },
  ramian_weapon_onehand_19_01_606: {
    id: 606,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.3] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.3] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.3] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.3] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 18.1] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 18.1] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 18.1] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 18.1] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3.7, -3.8], 12: [-3.9, -3.9] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [691, 705], 12: [719, 719] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [691, 705], 12: [719, 719] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
        ],
      },
    ],
  },
  ramian_weapon_onehand_19_12_699: {
    id: 699,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.6] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 19] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 19] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 19] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [17.3, 17.7], 12: [18.1, 19] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3.7, -3.8], 12: [-3.9, -4.1] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6.3] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [691, 705], 12: [719, 755] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [691, 705], 12: [719, 755] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
        ],
      },
    ],
  },
  ramian_weapon_onehand_22_12_826: {
    id: 826,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "skill_dmg_melee_pve",
            label: "Доп. урон умений ближнего боя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.4], 12: [0.5, 1] },
          },
          {
            key: "skill_dmg_ranged_pve",
            label: "Доп. урон умений дальнего боя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.4], 12: [0.5, 1] },
          },
          {
            key: "skill_dmg_spell_pve",
            label: "Доп. урон умений заклинателя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.4], 12: [0.5, 1] },
          },
          {
            key: "heal_skill_dmg_pve",
            label: "Урон исцеляющими умениями по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.4], 12: [0.5, 1] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.7] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.7] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.7] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [6.1, 6.2], 12: [6.3, 6.7] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [17.4, 17.8], 12: [18.1, 19.3] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [17.4, 17.8], 12: [18.1, 19.3] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [17.4, 17.8], 12: [18.1, 19.3] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [17.4, 17.8], 12: [18.1, 19.3] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3.7, -3.8], 12: [-3.9, -4.2] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [5.8, 5.9], 12: [6, 6.4] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [693, 708], 12: [719, 767] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [693, 708], 12: [719, 767] },
          },
        ],
      },
    ],
  },
  ramian_weapon_shield_18_03_498: {
    id: 498,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [15, 15], 12: [15, 15] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [15, 15], 12: [15, 15] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [15, 15], 12: [15, 15] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [15, 15], 12: [15, 15] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [3.2, 3.2], 12: [3.2, 3.2] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [2.4, 2.4], 12: [2.4, 2.4] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [1.5, 1.5], 12: [1.5, 1.5] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2, 2], 12: [2, 2] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
        ],
      },
    ],
  },
  ramian_weapon_shield_18_05_511: {
    id: 511,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [18, 18], 12: [18, 18] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [18, 18], 12: [18, 18] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [18, 18], 12: [18, 18] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [18, 18], 12: [18, 18] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [3.8, 3.8], 12: [3.8, 3.8] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [2.8, 2.8], 12: [2.8, 2.8] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [1.9, 1.9], 12: [1.9, 1.9] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.4, 2.4], 12: [2.4, 2.4] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
        ],
      },
    ],
  },
  ramian_weapon_shield_18_07_527: {
    id: 527,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [21.6, 21.6], 12: [21.6, 21.6] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [4.6, 4.6], 12: [4.6, 4.6] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.4, 3.4], 12: [3.4, 3.4] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.3, 2.3], 12: [2.3, 2.3] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 2.9], 12: [2.9, 2.9] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
        ],
      },
    ],
  },
  ramian_weapon_shield_19_01_609: {
    id: 609,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 22.4] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 22.4] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 22.4] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 22.4] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [4.6, 4.7], 12: [4.8, 4.8] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.6] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.3, 2.4], 12: [2.5, 2.5] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.1] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
        ],
      },
    ],
  },
  ramian_weapon_shield_19_12_702: {
    id: 702,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [21.6, 22], 12: [22.4, 23.5] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [4.6, 4.7], 12: [4.8, 5] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.8] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.3, 2.4], 12: [2.5, 2.6] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.3] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
        ],
      },
    ],
  },
  ramian_weapon_shield_22_12_829: {
    id: 829,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "skill_dmg_melee_pve",
            label: "Доп. урон умений ближнего боя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.2], 12: [0.3, 0.6] },
          },
          {
            key: "skill_dmg_ranged_pve",
            label: "Доп. урон умений дальнего боя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.2], 12: [0.3, 0.6] },
          },
          {
            key: "skill_dmg_spell_pve",
            label: "Доп. урон умений заклинателя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.2], 12: [0.3, 0.6] },
          },
          {
            key: "heal_skill_dmg_pve",
            label: "Урон исцеляющими умениями по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.2], 12: [0.3, 0.6] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 11: [21.7, 22.1], 12: [22.4, 23.9] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 11: [21.7, 22.1], 12: [22.4, 23.9] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 11: [21.7, 22.1], 12: [22.4, 23.9] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 11: [21.7, 22.1], 12: [22.4, 23.9] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [4.6, 4.7], 12: [4.8, 5.1] },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.9] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [2.3, 2.4], 12: [2.5, 2.6] },
          },
          {
            key: "move_speed",
            label: "Скорость передвижения",
            isPercent: true,
            ranges: { 11: [2.9, 3], 12: [3.1, 3.4] },
          },
        ],
      },
    ],
  },
  ramian_weapon_ranged_18_03_497: {
    id: 497,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [3.8, 3.8], 12: [3.8, 3.8] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [3.8, 3.8], 12: [3.8, 3.8] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [3.8, 3.8], 12: [3.8, 3.8] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [3.8, 3.8], 12: [3.8, 3.8] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [10.5, 10.5], 12: [10.5, 10.5] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [10.5, 10.5], 12: [10.5, 10.5] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [10.5, 10.5], 12: [10.5, 10.5] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [10.5, 10.5], 12: [10.5, 10.5] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-2.1, -2.1], 12: [-2.1, -2.1] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [3.2, 3.2], 12: [3.2, 3.2] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [410, 410], 12: [410, 410] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [410, 410], 12: [410, 410] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [80, 80], 12: [80, 80] },
          },
        ],
      },
    ],
  },
  ramian_weapon_ranged_18_05_510: {
    id: 510,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [4.5, 4.5], 12: [4.5, 4.5] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [4.5, 4.5], 12: [4.5, 4.5] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [4.5, 4.5], 12: [4.5, 4.5] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [4.5, 4.5], 12: [4.5, 4.5] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [12.6, 12.6], 12: [12.6, 12.6] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [12.6, 12.6], 12: [12.6, 12.6] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [12.6, 12.6], 12: [12.6, 12.6] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [12.6, 12.6], 12: [12.6, 12.6] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-2.5, -2.5], 12: [-2.5, -2.5] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [3.8, 3.8], 12: [3.8, 3.8] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [492, 492], 12: [492, 492] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [492, 492], 12: [492, 492] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [96, 96], 12: [96, 96] },
          },
        ],
      },
    ],
  },
  ramian_weapon_ranged_18_07_526: {
    id: 526,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [5.4, 5.4], 12: [5.4, 5.4] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [5.4, 5.4], 12: [5.4, 5.4] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [5.4, 5.4], 12: [5.4, 5.4] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [5.4, 5.4], 12: [5.4, 5.4] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [15.1, 15.1], 12: [15.1, 15.1] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [15.1, 15.1], 12: [15.1, 15.1] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [15.1, 15.1], 12: [15.1, 15.1] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [15.1, 15.1], 12: [15.1, 15.1] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3, -3], 12: [-3, -3] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [4.6, 4.6], 12: [4.6, 4.6] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [590, 590], 12: [590, 590] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [590, 590], 12: [590, 590] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 110], 12: [110, 110] },
          },
        ],
      },
    ],
  },
  ramian_weapon_ranged_19_01_608: {
    id: 608,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 5.6] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 5.6] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 5.6] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 5.6] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.7, 15.7] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.7, 15.7] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.7, 15.7] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.7, 15.7] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3, -3.1], 12: [-3.2, -3.2] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [4.6, 4.7], 12: [4.8, 4.8] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [590, 601], 12: [612, 612] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [590, 601], 12: [612, 612] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 114] },
          },
        ],
      },
    ],
  },
  ramian_weapon_ranged_19_12_701: {
    id: 701,
    minGrade: 11,
    groups: [
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 5.9] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 5.9] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 5.9] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 5.9] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.7, 16.5] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.7, 16.5] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.7, 16.5] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [15.1, 15.4], 12: [15.7, 16.5] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3, -3.1], 12: [-3.2, -3.4] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [4.6, 4.7], 12: [4.8, 5] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [590, 601], 12: [612, 643] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [590, 601], 12: [612, 643] },
          },
        ],
      },
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [110, 112], 12: [114, 120] },
          },
        ],
      },
    ],
  },
  ramian_weapon_ranged_22_12_828: {
    id: 828,
    minGrade: 11,
    groups: [
      /* ancient_stats */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [111, 113], 12: [114, 122] },
          },
        ],
      },
      /* ancient_bonus_PvE */ {
        pickCount: 1,
        options: [
          {
            key: "skill_dmg_melee_pve",
            label: "Доп. урон умений ближнего боя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.3], 12: [0.4, 0.9] },
          },
          {
            key: "skill_dmg_ranged_pve",
            label: "Доп. урон умений дальнего боя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.3], 12: [0.4, 0.9] },
          },
          {
            key: "skill_dmg_spell_pve",
            label: "Доп. урон умений заклинателя по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.3], 12: [0.4, 0.9] },
          },
          {
            key: "heal_skill_dmg_pve",
            label: "Урон исцеляющими умениями по монстрам",
            isPercent: true,
            ranges: { 11: [0.1, 0.3], 12: [0.4, 0.9] },
          },
        ],
      },
      /* ancient_bonus */ {
        pickCount: 2,
        options: [
          {
            key: "crit_chance_melee",
            label: "Шанс критического удара в ближнем бою",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 6] },
          },
          {
            key: "crit_chance_ranged",
            label: "Шанс критического удара в дальнем бою",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 6] },
          },
          {
            key: "crit_chance_spell",
            label: "Шанс критического удара заклинаниями",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 6] },
          },
          {
            key: "heal_crit_chance",
            label: "Шанс критического эффекта исцеления",
            isPercent: true,
            ranges: { 11: [5.4, 5.5], 12: [5.6, 6] },
          },
          {
            key: "crit_dmg_melee",
            label: "Критический урон в ближнем бою",
            isPercent: true,
            ranges: { 11: [15.2, 15.5], 12: [15.7, 16.8] },
          },
          {
            key: "crit_dmg_ranged",
            label: "Критический урон в дальнем бою",
            isPercent: true,
            ranges: { 11: [15.2, 15.5], 12: [15.7, 16.8] },
          },
          {
            key: "crit_dmg_spell",
            label: "Критический урон заклинаний",
            isPercent: true,
            ranges: { 11: [15.2, 15.5], 12: [15.7, 16.8] },
          },
          {
            key: "heal_crit_effect",
            label: "Критический эффект исцеления",
            isPercent: true,
            ranges: { 11: [15.2, 15.5], 12: [15.7, 16.8] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3, -3.1], 12: [-3.2, -3.5] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [4.6, 4.7], 12: [4.8, 5.1] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [592, 603], 12: [612, 653] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [592, 603], 12: [612, 653] },
          },
        ],
      },
    ],
  },

  // ===== Эфенские/индан аксессуары (main_stat/sub_stat/bonus из БД) =====
  ephen_1T_19_09_685: {
    id: 685,
    minGrade: 5,
    groups: [
      /* live.19.09.저승의 밤_목걸이_1T_main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 5: [22, 28], 6: [34, 40], 7: [46, 52], 8: [58, 58] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 5: [22, 28], 6: [34, 40], 7: [46, 52], 8: [58, 58] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 5: [22, 28], 6: [34, 40], 7: [46, 52], 8: [58, 58] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 5: [22, 28], 6: [34, 40], 7: [46, 52], 8: [58, 58] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 5: [22, 28], 6: [34, 40], 7: [46, 52], 8: [58, 58] },
          },
        ],
      },
      /* live.19.09.indun.저승의 밤_목걸이_1T_bonus */ {
        pickCount: 1,
        options: [
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 5: [13, 15], 6: [18, 20], 7: [23, 25], 8: [28, 28] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 5: [13, 15], 6: [18, 20], 7: [23, 25], 8: [28, 28] },
          },
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 5: [13, 15], 6: [18, 20], 7: [23, 25], 8: [28, 28] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 5: [13, 15], 6: [18, 20], 7: [23, 25], 8: [28, 28] },
          },
          {
            key: "skill_dmg_melee",
            label: "Дополнительный урон умений ближнего боя",
            isPercent: true,
            ranges: {
              5: [2.2, 2.4],
              6: [2.6, 2.8],
              7: [3, 3.2],
              8: [3.4, 3.4],
            },
          },
          {
            key: "skill_dmg_ranged",
            label: "Дополнительный урон умений дальнего боя",
            isPercent: true,
            ranges: {
              5: [2.2, 2.4],
              6: [2.6, 2.8],
              7: [3, 3.2],
              8: [3.4, 3.4],
            },
          },
          {
            key: "skill_dmg_spell",
            label: "Дополнительный урон умений заклинателя",
            isPercent: true,
            ranges: {
              5: [2.2, 2.4],
              6: [2.6, 2.8],
              7: [3, 3.2],
              8: [3.4, 3.4],
            },
          },
          {
            key: "heal_effectiveness_bonus",
            label: "Дополнительная эффективность исцеления",
            isPercent: true,
            ranges: {
              5: [2.2, 2.4],
              6: [2.6, 2.8],
              7: [3, 3.2],
              8: [3.4, 3.4],
            },
          },
        ],
      },
      /* unused */ { pickCount: 0, options: [] },
    ],
  },
  ephen_2T_19_09_686: {
    id: 686,
    minGrade: 9,
    groups: [
      /* live.19.09.indun_저승의 밤_목걸이_2T.main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: {
              9: [70, 76],
              10: [82, 88],
              11: [94, 100],
              12: [106, 106],
            },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: {
              9: [70, 76],
              10: [82, 88],
              11: [94, 100],
              12: [106, 106],
            },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: {
              9: [70, 76],
              10: [82, 88],
              11: [94, 100],
              12: [106, 106],
            },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: {
              9: [70, 76],
              10: [82, 88],
              11: [94, 100],
              12: [106, 106],
            },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: {
              9: [70, 76],
              10: [82, 88],
              11: [94, 100],
              12: [106, 106],
            },
          },
        ],
      },
      /* unused */ { pickCount: 0, options: [] },
      /* live.19.09.indun_저승의 밤_목걸이_2T.bonus */ {
        pickCount: 3,
        options: [
          {
            key: "atk_power_melee",
            label: "Сила атаки в ближнем бою",
            isPercent: false,
            ranges: { 9: [33, 35], 10: [38, 40], 11: [43, 45], 12: [50, 50] },
          },
          {
            key: "atk_power_ranged",
            label: "Сила атаки в дальнем бою",
            isPercent: false,
            ranges: { 9: [33, 35], 10: [38, 40], 11: [43, 45], 12: [50, 50] },
          },
          {
            key: "weapon_magic_power",
            label: "Сила заклинаний",
            isPercent: false,
            ranges: { 9: [33, 35], 10: [38, 40], 11: [43, 45], 12: [50, 50] },
          },
          {
            key: "weapon_heal_power",
            label: "Эффективность исцеления",
            isPercent: false,
            ranges: { 9: [33, 35], 10: [38, 40], 11: [43, 45], 12: [50, 50] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: {
              9: [1095, 1100],
              10: [1105, 1110],
              11: [1115, 1120],
              12: [1130, 1130],
            },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: {
              9: [1095, 1100],
              10: [1105, 1110],
              11: [1115, 1120],
              12: [1130, 1130],
            },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 9: [3.3, 3.5], 10: [3.8, 4], 11: [4.3, 4.5], 12: [5, 5] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: {
              9: [-2.6, -2.8],
              10: [-3, -3.2],
              11: [-3.4, -3.6],
              12: [-4, -4],
            },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: {
              9: [235, 240],
              10: [475, 480],
              11: [715, 720],
              12: [960, 960],
            },
          },
          {
            key: "skill_dmg_melee",
            label: "Дополнительный урон умений ближнего боя",
            isPercent: true,
            ranges: {
              9: [2.6, 2.8],
              10: [3, 3.2],
              11: [3.4, 3.6],
              12: [3.8, 3.8],
            },
          },
          {
            key: "skill_dmg_ranged",
            label: "Дополнительный урон умений дальнего боя",
            isPercent: true,
            ranges: {
              9: [2.6, 2.8],
              10: [3, 3.2],
              11: [3.4, 3.6],
              12: [3.8, 3.8],
            },
          },
          {
            key: "skill_dmg_spell",
            label: "Дополнительный урон умений заклинателя",
            isPercent: true,
            ranges: {
              9: [2.6, 2.8],
              10: [3, 3.2],
              11: [3.4, 3.6],
              12: [3.8, 3.8],
            },
          },
          {
            key: "heal_effectiveness_bonus",
            label: "Дополнительная эффективность исцеления",
            isPercent: true,
            ranges: {
              9: [2.6, 2.8],
              10: [3, 3.2],
              11: [3.4, 3.6],
              12: [3.8, 3.8],
            },
          },
        ],
      },
    ],
  },
  ephen_accessory_ear_base_881: {
    id: 881,
    minGrade: 0,
    groups: [
      /* accessory_ear_main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: {
              0: [16, 17],
              2: [18, 19],
              3: [19, 20],
              4: [21, 21],
              5: [22, 23],
              6: [23, 24],
              7: [25, 26],
              8: [26, 27],
              9: [28, 29],
              10: [30, 32],
              11: [32, 34],
              12: [35, 36],
            },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: {
              0: [16, 17],
              2: [18, 19],
              3: [19, 20],
              4: [21, 21],
              5: [22, 23],
              6: [23, 24],
              7: [25, 26],
              8: [26, 27],
              9: [28, 29],
              10: [30, 32],
              11: [32, 34],
              12: [35, 36],
            },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: {
              0: [16, 17],
              2: [18, 19],
              3: [19, 20],
              4: [21, 21],
              5: [22, 23],
              6: [23, 24],
              7: [25, 26],
              8: [26, 27],
              9: [28, 29],
              10: [30, 32],
              11: [32, 34],
              12: [35, 36],
            },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: {
              0: [16, 17],
              2: [18, 19],
              3: [19, 20],
              4: [21, 21],
              5: [22, 23],
              6: [23, 24],
              7: [25, 26],
              8: [26, 27],
              9: [28, 29],
              10: [30, 32],
              11: [32, 34],
              12: [35, 36],
            },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: {
              0: [16, 17],
              2: [18, 19],
              3: [19, 20],
              4: [21, 21],
              5: [22, 23],
              6: [23, 24],
              7: [25, 26],
              8: [26, 27],
              9: [28, 29],
              10: [30, 32],
              11: [32, 34],
              12: [35, 36],
            },
          },
        ],
      },
      /* accessory_ear_sub_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: {
              5: [4, 4],
              6: [5, 5],
              7: [5, 5],
              8: [5, 5],
              9: [5, 6],
              10: [6, 6],
              11: [6, 6],
              12: [7, 7],
            },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: {
              5: [4, 4],
              6: [5, 5],
              7: [5, 5],
              8: [5, 5],
              9: [5, 6],
              10: [6, 6],
              11: [6, 6],
              12: [7, 7],
            },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: {
              5: [4, 4],
              6: [5, 5],
              7: [5, 5],
              8: [5, 5],
              9: [5, 6],
              10: [6, 6],
              11: [6, 6],
              12: [7, 7],
            },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: {
              5: [4, 4],
              6: [5, 5],
              7: [5, 5],
              8: [5, 5],
              9: [5, 6],
              10: [6, 6],
              11: [6, 6],
              12: [7, 7],
            },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: {
              5: [4, 4],
              6: [5, 5],
              7: [5, 5],
              8: [5, 5],
              9: [5, 6],
              10: [6, 6],
              11: [6, 6],
              12: [7, 7],
            },
          },
        ],
      },
      /* accessory_ear_bonus */ {
        pickCount: 1,
        options: [
          {
            key: "wearable_magic_resistance",
            label: "Сопротивление",
            isPercent: false,
            ranges: {
              0: [204, 210],
              2: [214, 220],
              3: [224, 230],
              4: [234, 240],
              5: [244, 250],
              6: [254, 260],
              7: [264, 270],
              8: [274, 280],
              9: [284, 290],
              10: [294, 300],
              11: [304, 310],
              12: [314, 320],
            },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: {
              0: [1.9, 1.9],
              2: [2, 2],
              3: [2.1, 2.1],
              4: [2.2, 2.2],
              5: [2.3, 2.3],
              6: [2.4, 2.4],
              7: [2.5, 2.5],
              8: [2.6, 2.6],
              9: [2.7, 2.7],
              10: [2.8, 2.8],
              11: [2.9, 2.9],
              12: [3, 3],
            },
          },
          {
            key: "damage_taken_reduction",
            label: "Получаемый урон",
            isPercent: true,
            ranges: {
              0: [-1.9, -1.9],
              2: [-2, -2],
              3: [-2.1, -2.1],
              4: [-2.2, -2.2],
              5: [-2.3, -2.3],
              6: [-2.4, -2.4],
              7: [-2.5, -2.5],
              8: [-2.6, -2.6],
              9: [-2.7, -2.7],
              10: [-2.8, -2.8],
              11: [-2.9, -2.9],
              12: [-3, -3],
            },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: {
              0: [1.9, 1.9],
              2: [2, 2],
              3: [2.1, 2.1],
              4: [2.2, 2.2],
              5: [2.3, 2.3],
              6: [2.4, 2.4],
              7: [2.5, 2.5],
              8: [2.6, 2.6],
              9: [2.7, 2.7],
              10: [2.8, 2.8],
              11: [2.9, 2.9],
              12: [3, 3],
            },
          },
          {
            key: "casting_tolerance",
            label: "Задержка применения умений при получении удара",
            isPercent: false,
            ranges: {
              0: [76, 86],
              2: [91, 101],
              3: [106, 116],
              4: [121, 131],
              5: [136, 146],
              6: [151, 161],
              7: [166, 176],
              8: [181, 191],
              9: [196, 206],
              10: [211, 221],
              11: [226, 236],
              12: [241, 251],
            },
          },
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: {
              0: [432, 472],
              2: [482, 522],
              3: [532, 572],
              4: [582, 622],
              5: [632, 672],
              6: [682, 722],
              7: [732, 772],
              8: [782, 822],
              9: [832, 872],
              10: [882, 922],
              11: [932, 972],
              12: [982, 1022],
            },
          },
          {
            key: "max_mana",
            label: "Максимум маны",
            isPercent: false,
            ranges: {
              0: [286, 316],
              2: [326, 356],
              3: [366, 396],
              4: [406, 436],
              5: [446, 476],
              6: [486, 516],
              7: [526, 556],
              8: [566, 596],
              9: [606, 636],
              10: [646, 676],
              11: [686, 716],
              12: [726, 756],
            },
          },
          {
            key: "wearable_armor",
            label: "Защита",
            isPercent: false,
            ranges: {
              0: [204, 210],
              2: [214, 220],
              3: [224, 230],
              4: [234, 240],
              5: [244, 250],
              6: [254, 260],
              7: [264, 270],
              8: [274, 280],
              9: [284, 290],
              10: [294, 300],
              11: [304, 310],
              12: [314, 320],
            },
          },
        ],
      },
    ],
  },
  ephen_accessory_ear_ipnir_2T_19_09_896: {
    id: 896,
    minGrade: 10,
    groups: [
      /* live.19.09.accessory_ear.ipnir.2T.main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [37, 39], 12: [40, 41] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [37, 39], 12: [40, 41] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [37, 39], 12: [40, 41] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [37, 39], 12: [40, 41] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [37, 39], 12: [40, 41] },
          },
        ],
      },
      /* live.19.09.accessory_ear.ipnir2T.sub_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [7, 7], 11: [7, 7], 12: [8, 8] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [7, 7], 11: [7, 7], 12: [8, 8] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [7, 7], 11: [7, 7], 12: [8, 8] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [7, 7], 11: [7, 7], 12: [8, 8] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [7, 7], 11: [7, 7], 12: [8, 8] },
          },
        ],
      },
      /* live.19.09.accessory_ear.ipnir2T.bonus */ {
        pickCount: 2,
        options: [
          {
            key: "wearable_magic_resistance",
            label: "Сопротивление",
            isPercent: false,
            ranges: { 10: [338, 345], 11: [350, 357], 12: [361, 368] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 10: [3.2, 3.2], 11: [3.3, 3.3], 12: [3.5, 3.5] },
          },
          {
            key: "damage_taken_reduction",
            label: "Получаемый урон",
            isPercent: true,
            ranges: { 10: [-3.2, -3.2], 11: [-3.3, -3.3], 12: [-3.5, -3.5] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 10: [3.2, 3.2], 11: [3.3, 3.3], 12: [3.5, 3.5] },
          },
          {
            key: "casting_tolerance",
            label: "Задержка применения умений при получении удара",
            isPercent: false,
            ranges: { 10: [243, 254], 11: [260, 271], 12: [277, 289] },
          },
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 10: [1014, 1060], 11: [1072, 1118], 12: [1129, 1175] },
          },
          {
            key: "max_mana",
            label: "Максимум маны",
            isPercent: false,
            ranges: { 10: [743, 777], 11: [789, 823], 12: [835, 869] },
          },
          {
            key: "wearable_armor",
            label: "Защита",
            isPercent: false,
            ranges: { 10: [338, 345], 11: [350, 357], 12: [361, 368] },
          },
        ],
      },
    ],
  },
  ephen_accessory_ear_ipnir_3T_23_03_910: {
    id: 910,
    minGrade: 11,
    groups: [
      /* live.23.03.accessory_ear.ipnir.3T.main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [39, 41], 12: [42, 46] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [39, 41], 12: [42, 46] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [39, 41], 12: [42, 46] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [39, 41], 12: [42, 46] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [39, 41], 12: [42, 46] },
          },
        ],
      },
      /* live.23.03.accessory_ear.ipnir3T.sub_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [8, 8], 12: [9, 9] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [8, 8], 12: [9, 9] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [8, 8], 12: [9, 9] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [8, 8], 12: [9, 9] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [8, 8], 12: [9, 9] },
          },
        ],
      },
      /* live.23.03.accessory_ear.ipnir3T.bonus */ {
        pickCount: 2,
        options: [
          {
            key: "wearable_magic_resistance",
            label: "Сопротивление",
            isPercent: false,
            ranges: { 11: [355, 362], 12: [366, 398] },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.7] },
          },
          {
            key: "damage_taken_reduction",
            label: "Получаемый урон",
            isPercent: true,
            ranges: { 11: [-3.4, -3.5], 12: [-3.6, -3.7] },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.7] },
          },
          {
            key: "casting_tolerance",
            label: "Задержка применения умений при получении удара",
            isPercent: false,
            ranges: { 11: [267, 278], 12: [284, 316] },
          },
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [1088, 1135], 12: [1146, 1270] },
          },
          {
            key: "max_mana",
            label: "Максимум маны",
            isPercent: false,
            ranges: { 11: [801, 836], 12: [848, 939] },
          },
          {
            key: "wearable_armor",
            label: "Защита",
            isPercent: false,
            ranges: { 11: [355, 362], 12: [366, 398] },
          },
        ],
      },
    ],
  },
  ephen_finger1T_18_12_590: {
    id: 590,
    minGrade: 5,
    groups: [
      /* live.18.12.indun.finger1T_main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: {
              5: [15, 17],
              6: [18, 20],
              7: [21, 25],
              8: [26, 26],
              9: [26, 26],
              10: [26, 26],
              11: [26, 26],
              12: [26, 26],
            },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: {
              5: [15, 17],
              6: [18, 20],
              7: [21, 25],
              8: [26, 26],
              9: [26, 26],
              10: [26, 26],
              11: [26, 26],
              12: [26, 26],
            },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: {
              5: [15, 17],
              6: [18, 20],
              7: [21, 25],
              8: [26, 26],
              9: [26, 26],
              10: [26, 26],
              11: [26, 26],
              12: [26, 26],
            },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: {
              5: [15, 17],
              6: [18, 20],
              7: [21, 25],
              8: [26, 26],
              9: [26, 26],
              10: [26, 26],
              11: [26, 26],
              12: [26, 26],
            },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: {
              5: [15, 17],
              6: [18, 20],
              7: [21, 25],
              8: [26, 26],
              9: [26, 26],
              10: [26, 26],
              11: [26, 26],
              12: [26, 26],
            },
          },
        ],
      },
      /* unused */ { pickCount: 0, options: [] },
      /* unused */ { pickCount: 0, options: [] },
    ],
  },
  ephen_finger2T_18_12_591: {
    id: 591,
    minGrade: 7,
    groups: [
      /* live.18.12.indun.finger2T_main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: {
              7: [23, 23],
              8: [24, 25],
              9: [26, 26],
              10: [27, 27],
              11: [27, 27],
              12: [27, 27],
            },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: {
              7: [23, 23],
              8: [24, 25],
              9: [26, 26],
              10: [27, 27],
              11: [27, 27],
              12: [27, 27],
            },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: {
              7: [23, 23],
              8: [24, 25],
              9: [26, 26],
              10: [27, 27],
              11: [27, 27],
              12: [27, 27],
            },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: {
              7: [23, 23],
              8: [24, 25],
              9: [26, 26],
              10: [27, 27],
              11: [27, 27],
              12: [27, 27],
            },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: {
              7: [23, 23],
              8: [24, 25],
              9: [26, 26],
              10: [27, 27],
              11: [27, 27],
              12: [27, 27],
            },
          },
        ],
      },
      /* live.18.12.indun.finger2T_sub_stat */ {
        pickCount: 1,
        options: [
          {
            key: "wearable_magic_resistance",
            label: "Сопротивление",
            isPercent: false,
            ranges: {
              7: [168, 175],
              8: [179, 186],
              9: [190, 195],
              10: [202, 202],
              11: [202, 202],
              12: [202, 202],
            },
          },
          {
            key: "wearable_armor",
            label: "Защита",
            isPercent: false,
            ranges: {
              7: [168, 175],
              8: [179, 186],
              9: [190, 195],
              10: [202, 202],
              11: [202, 202],
              12: [202, 202],
            },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: {
              7: [1.6, 1.6],
              8: [1.7, 1.7],
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [1.9, 1.9],
              12: [1.9, 1.9],
            },
          },
          {
            key: "damage_taken_reduction",
            label: "Получаемый урон",
            isPercent: true,
            ranges: {
              7: [-1.6, -1.6],
              8: [-1.7, -1.7],
              9: [-1.8, -1.8],
              10: [-1.9, -1.9],
              11: [-1.9, -1.9],
              12: [-1.9, -1.9],
            },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: {
              7: [1.6, 1.6],
              8: [1.7, 1.7],
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [1.9, 1.9],
              12: [1.9, 1.9],
            },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: {
              7: [1.6, 1.6],
              8: [1.7, 1.7],
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [1.9, 1.9],
              12: [1.9, 1.9],
            },
          },
          {
            key: "casting_tolerance",
            label: "Задержка применения умений при получении удара",
            isPercent: false,
            ranges: {
              7: [132, 137],
              8: [141, 146],
              9: [150, 153],
              10: [158, 158],
              11: [158, 158],
              12: [158, 158],
            },
          },
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: {
              7: [536, 558],
              8: [572, 593],
              9: [608, 622],
              10: [644, 644],
              11: [644, 644],
              12: [644, 644],
            },
          },
          {
            key: "max_mana",
            label: "Максимум маны",
            isPercent: false,
            ranges: {
              7: [397, 413],
              8: [423, 439],
              9: [450, 460],
              10: [476, 476],
              11: [476, 476],
              12: [476, 476],
            },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: {
              7: [1.6, 1.6],
              8: [1.7, 1.7],
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [1.9, 1.9],
              12: [1.9, 1.9],
            },
          },
        ],
      },
      /* unused */ { pickCount: 0, options: [] },
    ],
  },
  ephen_finger3T_18_12_592: {
    id: 592,
    minGrade: 9,
    groups: [
      /* live.18.12.indun.finger3T_main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 9: [26, 26], 10: [27, 28], 11: [29, 29], 12: [30, 30] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 9: [26, 26], 10: [27, 28], 11: [29, 29], 12: [30, 30] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 9: [26, 26], 10: [27, 28], 11: [29, 29], 12: [30, 30] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 9: [26, 26], 10: [27, 28], 11: [29, 29], 12: [30, 30] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 9: [26, 26], 10: [27, 28], 11: [29, 29], 12: [30, 30] },
          },
        ],
      },
      /* unused */ { pickCount: 0, options: [] },
      /* live.18.12.indun.finger3T_sub_stat */ {
        pickCount: 2,
        options: [
          {
            key: "wearable_magic_resistance",
            label: "Сопротивление",
            isPercent: false,
            ranges: {
              9: [190, 195],
              10: [202, 206],
              11: [213, 217],
              12: [224, 224],
            },
          },
          {
            key: "wearable_armor",
            label: "Защита",
            isPercent: false,
            ranges: {
              9: [190, 195],
              10: [202, 206],
              11: [213, 217],
              12: [224, 224],
            },
          },
          {
            key: "dodge_chance",
            label: "Уклонение",
            isPercent: true,
            ranges: {
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [2, 2],
              12: [2.1, 2.1],
            },
          },
          {
            key: "damage_taken_reduction",
            label: "Получаемый урон",
            isPercent: true,
            ranges: {
              9: [-1.8, -1.8],
              10: [-1.9, -1.9],
              11: [-2, -2],
              12: [-2.1, -2.1],
            },
          },
          {
            key: "block_chance",
            label: "Блокирование",
            isPercent: true,
            ranges: {
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [2, 2],
              12: [2.1, 2.1],
            },
          },
          {
            key: "ranged_block_chance",
            label: "Блокирование атак в дальнем бою",
            isPercent: true,
            ranges: {
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [2, 2],
              12: [2.1, 2.1],
            },
          },
          {
            key: "casting_tolerance",
            label: "Задержка применения умений при получении удара",
            isPercent: false,
            ranges: {
              9: [150, 153],
              10: [158, 162],
              11: [167, 171],
              12: [176, 176],
            },
          },
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: {
              9: [608, 622],
              10: [644, 658],
              11: [679, 694],
              12: [715, 715],
            },
          },
          {
            key: "max_mana",
            label: "Максимум маны",
            isPercent: false,
            ranges: {
              9: [450, 460],
              10: [476, 487],
              11: [503, 513],
              12: [529, 529],
            },
          },
          {
            key: "incoming_heal",
            label: "Получаемое исцеление",
            isPercent: true,
            ranges: {
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [2, 2],
              12: [2.1, 2.1],
            },
          },
        ],
      },
    ],
  },
  ephen_finger1T_18_12_587: {
    id: 587,
    minGrade: 5,
    groups: [
      /* live.18.12.indun.finger1T_main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: {
              5: [15, 17],
              6: [18, 20],
              7: [21, 25],
              8: [26, 26],
              9: [26, 26],
              10: [26, 26],
              11: [26, 26],
              12: [26, 26],
            },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: {
              5: [15, 17],
              6: [18, 20],
              7: [21, 25],
              8: [26, 26],
              9: [26, 26],
              10: [26, 26],
              11: [26, 26],
              12: [26, 26],
            },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: {
              5: [15, 17],
              6: [18, 20],
              7: [21, 25],
              8: [26, 26],
              9: [26, 26],
              10: [26, 26],
              11: [26, 26],
              12: [26, 26],
            },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: {
              5: [15, 17],
              6: [18, 20],
              7: [21, 25],
              8: [26, 26],
              9: [26, 26],
              10: [26, 26],
              11: [26, 26],
              12: [26, 26],
            },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: {
              5: [15, 17],
              6: [18, 20],
              7: [21, 25],
              8: [26, 26],
              9: [26, 26],
              10: [26, 26],
              11: [26, 26],
              12: [26, 26],
            },
          },
        ],
      },
      /* unused */ { pickCount: 0, options: [] },
      /* unused */ { pickCount: 0, options: [] },
    ],
  },
  ephen_finger2T_18_12_588: {
    id: 588,
    minGrade: 7,
    groups: [
      /* live.18.12.indun.finger2T_main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: {
              7: [23, 23],
              8: [24, 25],
              9: [26, 26],
              10: [27, 27],
              11: [27, 27],
              12: [27, 27],
            },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: {
              7: [23, 23],
              8: [24, 25],
              9: [26, 26],
              10: [27, 27],
              11: [27, 27],
              12: [27, 27],
            },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: {
              7: [23, 23],
              8: [24, 25],
              9: [26, 26],
              10: [27, 27],
              11: [27, 27],
              12: [27, 27],
            },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: {
              7: [23, 23],
              8: [24, 25],
              9: [26, 26],
              10: [27, 27],
              11: [27, 27],
              12: [27, 27],
            },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: {
              7: [23, 23],
              8: [24, 25],
              9: [26, 26],
              10: [27, 27],
              11: [27, 27],
              12: [27, 27],
            },
          },
        ],
      },
      /* live.18.12.indun.finger2T_sub_stat */ {
        pickCount: 1,
        options: [
          {
            key: "wearable_magic_resistance",
            label: "Сопротивление",
            isPercent: false,
            ranges: {
              7: [168, 175],
              8: [179, 186],
              9: [190, 195],
              10: [202, 202],
              11: [202, 202],
              12: [202, 202],
            },
          },
          {
            key: "wearable_armor",
            label: "Защита",
            isPercent: false,
            ranges: {
              7: [168, 175],
              8: [179, 186],
              9: [190, 195],
              10: [202, 202],
              11: [202, 202],
              12: [202, 202],
            },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: {
              7: [257, 267],
              8: [274, 284],
              9: [291, 298],
              10: [308, 308],
              11: [308, 308],
              12: [308, 308],
            },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: {
              7: [257, 267],
              8: [274, 284],
              9: [291, 298],
              10: [308, 308],
              11: [308, 308],
              12: [308, 308],
            },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: {
              7: [2, 2.1],
              8: [2.2, 2.2],
              9: [2.3, 2.3],
              10: [2.4, 2.4],
              11: [2.4, 2.4],
              12: [2.4, 2.4],
            },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: {
              7: [-1.6, -1.6],
              8: [-1.7, -1.7],
              9: [-1.8, -1.8],
              10: [-1.9, -1.9],
              11: [-1.9, -1.9],
              12: [-1.9, -1.9],
            },
          },
          {
            key: "skill_dmg_melee",
            label: "Дополнительный урон умений ближнего боя",
            isPercent: true,
            ranges: {
              7: [1.6, 1.6],
              8: [1.7, 1.7],
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [1.9, 1.9],
              12: [1.9, 1.9],
            },
          },
          {
            key: "skill_dmg_ranged",
            label: "Дополнительный урон умений дальнего боя",
            isPercent: true,
            ranges: {
              7: [1.6, 1.6],
              8: [1.7, 1.7],
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [1.9, 1.9],
              12: [1.9, 1.9],
            },
          },
          {
            key: "skill_dmg_spell",
            label: "Дополнительный урон умений заклинателя",
            isPercent: true,
            ranges: {
              7: [1.6, 1.6],
              8: [1.7, 1.7],
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [1.9, 1.9],
              12: [1.9, 1.9],
            },
          },
          {
            key: "heal_effectiveness_bonus",
            label: "Дополнительная эффективность исцеления",
            isPercent: true,
            ranges: {
              7: [1.6, 1.6],
              8: [1.7, 1.7],
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [1.9, 1.9],
              12: [1.9, 1.9],
            },
          },
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: {
              7: [536, 558],
              8: [572, 593],
              9: [608, 622],
              10: [644, 644],
              11: [644, 644],
              12: [644, 644],
            },
          },
          {
            key: "max_mana",
            label: "Максимум маны",
            isPercent: false,
            ranges: {
              7: [397, 413],
              8: [423, 439],
              9: [450, 460],
              10: [476, 476],
              11: [476, 476],
              12: [476, 476],
            },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: {
              7: [516, 537],
              8: [550, 571],
              9: [585, 599],
              10: [619, 619],
              11: [619, 619],
              12: [619, 619],
            },
          },
        ],
      },
      /* unused */ { pickCount: 0, options: [] },
    ],
  },
  ephen_finger3T_18_12_589: {
    id: 589,
    minGrade: 9,
    groups: [
      /* live.18.12.indun.finger3T_main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 9: [26, 26], 10: [27, 28], 11: [29, 29], 12: [30, 30] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 9: [26, 26], 10: [27, 28], 11: [29, 29], 12: [30, 30] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 9: [26, 26], 10: [27, 28], 11: [29, 29], 12: [30, 30] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 9: [26, 26], 10: [27, 28], 11: [29, 29], 12: [30, 30] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 9: [26, 26], 10: [27, 28], 11: [29, 29], 12: [30, 30] },
          },
        ],
      },
      /* unused */ { pickCount: 0, options: [] },
      /* live.18.12.indun.finger3T_sub_stat */ {
        pickCount: 2,
        options: [
          {
            key: "wearable_magic_resistance",
            label: "Сопротивление",
            isPercent: false,
            ranges: {
              9: [190, 195],
              10: [202, 206],
              11: [213, 217],
              12: [224, 224],
            },
          },
          {
            key: "wearable_armor",
            label: "Защита",
            isPercent: false,
            ranges: {
              9: [190, 195],
              10: [202, 206],
              11: [213, 217],
              12: [224, 224],
            },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: {
              9: [291, 298],
              10: [308, 315],
              11: [325, 332],
              12: [342, 342],
            },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: {
              9: [291, 298],
              10: [308, 315],
              11: [325, 332],
              12: [342, 342],
            },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: {
              9: [2.3, 2.3],
              10: [2.4, 2.5],
              11: [2.6, 2.6],
              12: [2.7, 2.7],
            },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: {
              9: [-1.8, -1.8],
              10: [-1.9, -1.9],
              11: [-2, -2],
              12: [-2.1, -2.1],
            },
          },
          {
            key: "skill_dmg_melee",
            label: "Дополнительный урон умений ближнего боя",
            isPercent: true,
            ranges: {
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [2, 2],
              12: [2.1, 2.1],
            },
          },
          {
            key: "skill_dmg_ranged",
            label: "Дополнительный урон умений дальнего боя",
            isPercent: true,
            ranges: {
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [2, 2],
              12: [2.1, 2.1],
            },
          },
          {
            key: "skill_dmg_spell",
            label: "Дополнительный урон умений заклинателя",
            isPercent: true,
            ranges: {
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [2, 2],
              12: [2.1, 2.1],
            },
          },
          {
            key: "heal_effectiveness_bonus",
            label: "Дополнительная эффективность исцеления",
            isPercent: true,
            ranges: {
              9: [1.8, 1.8],
              10: [1.9, 1.9],
              11: [2, 2],
              12: [2.1, 2.1],
            },
          },
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: {
              9: [608, 622],
              10: [644, 658],
              11: [679, 694],
              12: [715, 715],
            },
          },
          {
            key: "max_mana",
            label: "Максимум маны",
            isPercent: false,
            ranges: {
              9: [450, 460],
              10: [476, 487],
              11: [503, 513],
              12: [529, 529],
            },
          },
          {
            key: "bulls_eye",
            label: "Меткость",
            isPercent: false,
            ranges: {
              9: [585, 599],
              10: [619, 633],
              11: [654, 667],
              12: [688, 688],
            },
          },
        ],
      },
    ],
  },
  ephen_accessory_finger_base_882: {
    id: 882,
    minGrade: 0,
    groups: [
      /* accessory_finger_main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: {
              0: [16, 17],
              2: [18, 19],
              3: [19, 20],
              4: [21, 21],
              5: [22, 23],
              6: [23, 24],
              7: [25, 26],
              8: [26, 27],
              9: [28, 29],
              10: [30, 32],
              11: [32, 34],
              12: [35, 36],
            },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: {
              0: [16, 17],
              2: [18, 19],
              3: [19, 20],
              4: [21, 21],
              5: [22, 23],
              6: [23, 24],
              7: [25, 26],
              8: [26, 27],
              9: [28, 29],
              10: [30, 32],
              11: [32, 34],
              12: [35, 36],
            },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: {
              0: [16, 17],
              2: [18, 19],
              3: [19, 20],
              4: [21, 21],
              5: [22, 23],
              6: [23, 24],
              7: [25, 26],
              8: [26, 27],
              9: [28, 29],
              10: [30, 32],
              11: [32, 34],
              12: [35, 36],
            },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: {
              0: [16, 17],
              2: [18, 19],
              3: [19, 20],
              4: [21, 21],
              5: [22, 23],
              6: [23, 24],
              7: [25, 26],
              8: [26, 27],
              9: [28, 29],
              10: [30, 32],
              11: [32, 34],
              12: [35, 36],
            },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: {
              0: [16, 17],
              2: [18, 19],
              3: [19, 20],
              4: [21, 21],
              5: [22, 23],
              6: [23, 24],
              7: [25, 26],
              8: [26, 27],
              9: [28, 29],
              10: [30, 32],
              11: [32, 34],
              12: [35, 36],
            },
          },
        ],
      },
      /* accessory_finger_sub_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: {
              5: [4, 4],
              6: [5, 5],
              7: [5, 5],
              8: [5, 5],
              9: [5, 6],
              10: [6, 6],
              11: [6, 6],
              12: [7, 7],
            },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: {
              5: [4, 4],
              6: [5, 5],
              7: [5, 5],
              8: [5, 5],
              9: [5, 6],
              10: [6, 6],
              11: [6, 6],
              12: [7, 7],
            },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: {
              5: [4, 4],
              6: [5, 5],
              7: [5, 5],
              8: [5, 5],
              9: [5, 6],
              10: [6, 6],
              11: [6, 6],
              12: [7, 7],
            },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: {
              5: [4, 4],
              6: [5, 5],
              7: [5, 5],
              8: [5, 5],
              9: [5, 6],
              10: [6, 6],
              11: [6, 6],
              12: [7, 7],
            },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: {
              5: [4, 4],
              6: [5, 5],
              7: [5, 5],
              8: [5, 5],
              9: [5, 6],
              10: [6, 6],
              11: [6, 6],
              12: [7, 7],
            },
          },
        ],
      },
      /* accessory_finger_bonus */ {
        pickCount: 1,
        options: [
          {
            key: "wearable_magic_resistance",
            label: "Сопротивление",
            isPercent: false,
            ranges: {
              0: [204, 210],
              2: [214, 220],
              3: [224, 230],
              4: [234, 240],
              5: [244, 250],
              6: [254, 260],
              7: [264, 270],
              8: [274, 280],
              9: [284, 290],
              10: [294, 300],
              11: [304, 310],
              12: [314, 320],
            },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: {
              0: [2.7, 2.7],
              2: [2.8, 2.8],
              3: [2.9, 2.9],
              4: [3, 3],
              5: [3.1, 3.1],
              6: [3.2, 3.2],
              7: [3.3, 3.3],
              8: [3.4, 3.4],
              9: [3.5, 3.5],
              10: [3.6, 3.6],
              11: [3.7, 3.7],
              12: [3.8, 3.8],
            },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: {
              0: [-1.9, -1.9],
              2: [-2, -2],
              3: [-2.1, -2.1],
              4: [-2.2, -2.2],
              5: [-2.3, -2.3],
              6: [-2.4, -2.4],
              7: [-2.5, -2.5],
              8: [-2.6, -2.6],
              9: [-2.7, -2.7],
              10: [-2.8, -2.8],
              11: [-2.9, -2.9],
              12: [-3, -3],
            },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: {
              0: [373, 379],
              2: [383, 389],
              3: [393, 399],
              4: [403, 409],
              5: [413, 419],
              6: [423, 429],
              7: [433, 439],
              8: [443, 449],
              9: [453, 459],
              10: [463, 469],
              11: [473, 479],
              12: [483, 489],
            },
          },
          {
            key: "skill_dmg_melee",
            label: "Дополнительный урон умений ближнего боя",
            isPercent: true,
            ranges: {
              0: [1.9, 1.9],
              2: [2, 2],
              3: [2.1, 2.1],
              4: [2.2, 2.2],
              5: [2.3, 2.3],
              6: [2.4, 2.4],
              7: [2.5, 2.5],
              8: [2.6, 2.6],
              9: [2.7, 2.7],
              10: [2.8, 2.8],
              11: [2.9, 2.9],
              12: [3, 3],
            },
          },
          {
            key: "skill_dmg_ranged",
            label: "Дополнительный урон умений дальнего боя",
            isPercent: true,
            ranges: {
              0: [1.9, 1.9],
              2: [2, 2],
              3: [2.1, 2.1],
              4: [2.2, 2.2],
              5: [2.3, 2.3],
              6: [2.4, 2.4],
              7: [2.5, 2.5],
              8: [2.6, 2.6],
              9: [2.7, 2.7],
              10: [2.8, 2.8],
              11: [2.9, 2.9],
              12: [3, 3],
            },
          },
          {
            key: "skill_dmg_spell",
            label: "Дополнительный урон умений заклинателя",
            isPercent: true,
            ranges: {
              0: [1.9, 1.9],
              2: [2, 2],
              3: [2.1, 2.1],
              4: [2.2, 2.2],
              5: [2.3, 2.3],
              6: [2.4, 2.4],
              7: [2.5, 2.5],
              8: [2.6, 2.6],
              9: [2.7, 2.7],
              10: [2.8, 2.8],
              11: [2.9, 2.9],
              12: [3, 3],
            },
          },
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: {
              0: [432, 472],
              2: [482, 522],
              3: [532, 572],
              4: [582, 622],
              5: [632, 672],
              6: [682, 722],
              7: [732, 772],
              8: [782, 822],
              9: [832, 872],
              10: [882, 922],
              11: [932, 972],
              12: [982, 1022],
            },
          },
          {
            key: "max_mana",
            label: "Максимум маны",
            isPercent: false,
            ranges: {
              0: [286, 316],
              2: [326, 356],
              3: [366, 396],
              4: [406, 436],
              5: [446, 476],
              6: [486, 516],
              7: [526, 556],
              8: [566, 596],
              9: [606, 636],
              10: [646, 676],
              11: [686, 716],
              12: [726, 756],
            },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: {
              0: [373, 379],
              2: [383, 389],
              3: [393, 399],
              4: [403, 409],
              5: [413, 419],
              6: [423, 429],
              7: [433, 439],
              8: [443, 449],
              9: [453, 459],
              10: [463, 469],
              11: [473, 479],
              12: [483, 489],
            },
          },
          {
            key: "wearable_armor",
            label: "Защита",
            isPercent: false,
            ranges: {
              0: [204, 210],
              2: [214, 220],
              3: [224, 230],
              4: [234, 240],
              5: [244, 250],
              6: [254, 260],
              7: [264, 270],
              8: [274, 280],
              9: [284, 290],
              10: [294, 300],
              11: [304, 310],
              12: [314, 320],
            },
          },
        ],
      },
    ],
  },
  ephen_accessory_finger_ipnir2T_19_09_894: {
    id: 894,
    minGrade: 10,
    groups: [
      /* live.19.09.accessory_finger.ipnir2T.main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [37, 39], 12: [40, 41] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [37, 39], 12: [40, 41] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [37, 39], 12: [40, 41] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [37, 39], 12: [40, 41] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [35, 37], 11: [37, 39], 12: [40, 41] },
          },
        ],
      },
      /* live.19.09.accessory_finger.ipnir2T.sub_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 10: [7, 7], 11: [7, 7], 12: [8, 8] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 10: [7, 7], 11: [7, 7], 12: [8, 8] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 10: [7, 7], 11: [7, 7], 12: [8, 8] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 10: [7, 7], 11: [7, 7], 12: [8, 8] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 10: [7, 7], 11: [7, 7], 12: [8, 8] },
          },
        ],
      },
      /* live.19.09.accessory_finger.ipnir2T.bonus */ {
        pickCount: 2,
        options: [
          {
            key: "wearable_magic_resistance",
            label: "Сопротивление",
            isPercent: false,
            ranges: { 10: [338, 345], 11: [350, 357], 12: [361, 368] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 10: [4.1, 4.1], 11: [4.3, 4.3], 12: [4.4, 4.4] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 10: [-3.2, -3.2], 11: [-3.3, -3.3], 12: [-3.5, -3.5] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 10: [532, 539], 11: [544, 551], 12: [555, 562] },
          },
          {
            key: "skill_dmg_melee",
            label: "Дополнительный урон умений ближнего боя",
            isPercent: true,
            ranges: { 10: [3.2, 3.2], 11: [3.3, 3.3], 12: [3.5, 3.5] },
          },
          {
            key: "skill_dmg_ranged",
            label: "Дополнительный урон умений дальнего боя",
            isPercent: true,
            ranges: { 10: [3.2, 3.2], 11: [3.3, 3.3], 12: [3.5, 3.5] },
          },
          {
            key: "skill_dmg_spell",
            label: "Дополнительный урон умений заклинателя",
            isPercent: true,
            ranges: { 10: [3.2, 3.2], 11: [3.3, 3.3], 12: [3.5, 3.5] },
          },
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 10: [1014, 1060], 11: [1072, 1118], 12: [1129, 1175] },
          },
          {
            key: "max_mana",
            label: "Максимум маны",
            isPercent: false,
            ranges: { 10: [743, 777], 11: [789, 823], 12: [835, 869] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 10: [532, 539], 11: [544, 551], 12: [555, 562] },
          },
          {
            key: "wearable_armor",
            label: "Защита",
            isPercent: false,
            ranges: { 10: [338, 345], 11: [350, 357], 12: [361, 368] },
          },
        ],
      },
    ],
  },
  ephen_accessory_finger_ipnir3T_23_03_908: {
    id: 908,
    minGrade: 11,
    groups: [
      /* live.23.03.accessory_finger.ipnir3T.main_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [39, 41], 12: [42, 46] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [39, 41], 12: [42, 46] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [39, 41], 12: [42, 46] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [39, 41], 12: [42, 46] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [39, 41], 12: [42, 46] },
          },
        ],
      },
      /* live.23.03.accessory_finger.ipnir3T.sub_stat */ {
        pickCount: 1,
        options: [
          {
            key: "str",
            label: "Сила",
            isPercent: false,
            ranges: { 11: [8, 8], 12: [9, 9] },
          },
          {
            key: "dex",
            label: "Ловкость",
            isPercent: false,
            ranges: { 11: [8, 8], 12: [9, 9] },
          },
          {
            key: "sta",
            label: "Выносливость",
            isPercent: false,
            ranges: { 11: [8, 8], 12: [9, 9] },
          },
          {
            key: "int",
            label: "Интеллект",
            isPercent: false,
            ranges: { 11: [8, 8], 12: [9, 9] },
          },
          {
            key: "spi",
            label: "Сила духа",
            isPercent: false,
            ranges: { 11: [8, 8], 12: [9, 9] },
          },
        ],
      },
      /* live.23.03.accessory_finger.ipnir3T.bonus */ {
        pickCount: 2,
        options: [
          {
            key: "wearable_magic_resistance",
            label: "Сопротивление",
            isPercent: false,
            ranges: { 11: [355, 362], 12: [366, 398] },
          },
          {
            key: "attack_speed",
            label: "Скорость атаки",
            isPercent: true,
            ranges: { 11: [4.4, 4.5], 12: [4.5, 4.6] },
          },
          {
            key: "skill_speed",
            label: "Время применения умений",
            isPercent: true,
            ranges: { 11: [-3.4, -3.5], 12: [-3.6, -3.7] },
          },
          {
            key: "armor_penetration",
            label: "Пробивание брони",
            isPercent: false,
            ranges: { 11: [545, 552], 12: [556, 600] },
          },
          {
            key: "skill_dmg_melee",
            label: "Дополнительный урон умений ближнего боя",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.7] },
          },
          {
            key: "skill_dmg_ranged",
            label: "Дополнительный урон умений дальнего боя",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.7] },
          },
          {
            key: "skill_dmg_spell",
            label: "Дополнительный урон умений заклинателя",
            isPercent: true,
            ranges: { 11: [3.4, 3.5], 12: [3.6, 3.7] },
          },
          {
            key: "max_hp",
            label: "Объем здоровья",
            isPercent: false,
            ranges: { 11: [1088, 1135], 12: [1146, 1270] },
          },
          {
            key: "max_mana",
            label: "Максимум маны",
            isPercent: false,
            ranges: { 11: [801, 836], 12: [848, 939] },
          },
          {
            key: "resist_ignore",
            label: "Игнорирование сопротивления",
            isPercent: false,
            ranges: { 11: [545, 552], 12: [556, 600] },
          },
          {
            key: "wearable_armor",
            label: "Защита",
            isPercent: false,
            ranges: { 11: [355, 362], 12: [366, 398] },
          },
        ],
      },
    ],
  },
};
