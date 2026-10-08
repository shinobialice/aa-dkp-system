export type RuneSetTier = {
  count: number;
  text: string;
};

export type RuneSet = {
  runeId: number;
  name: string;
  size: number;
  tiers: RuneSetTier[];
};

type SetWithoutSize = Omit<RuneSet, "size">;

const EPHEN_SET_SIZE = 8;
const IFNIR_SET_SIZE = 6;
const LIBRARY_SET_SIZE = 7;

const FOUR_PIECE_TEXT = "Устойчивость к критическому урону: +560 ед.";
const EIGHT_PIECE_EXTRA_TEXT =
  "Доп. урон и эффективность исцеления при ношении двуручного оружия: +4.5%";

// Урон умений веток в характеристиках не считается, поэтому эти строки без
// двоеточия: они только показываются в подсказке.
const IFNIR_RUNE_SETS: SetWithoutSize[] = [
  {
    runeId: 55262,
    name: "Легендарная руна ифнирского бойца",
    tiers: [
      { count: 4, text: "Парирование атак ближнего боя: +4%" },
      { count: 6, text: "Урон умений веток «Нападение» и «Коварство» +2%" },
    ],
  },
  {
    runeId: 55267,
    name: "Легендарная руна ифнирского лучника",
    tiers: [
      { count: 4, text: "Шанс обхода обороны: +4%" },
      {
        count: 6,
        text: "Урон умений веток «Преследование» и «Стрельба» +2%",
      },
    ],
  },
  {
    runeId: 55272,
    name: "Легендарная руна ифнирского чародея",
    tiers: [
      { count: 4, text: "Здоровье: +600 ед." },
      { count: 6, text: "Урон умений веток «Волшебство» и «Гнев» +2%" },
    ],
  },
  {
    runeId: 55277,
    name: "Легендарная руна ифнирского лекаря",
    tiers: [
      { count: 4, text: "Здоровье: +600 ед." },
      { count: 6, text: "Урон умений веток «Исцеление» и «Танец» +2%" },
    ],
  },
];

const LIBRARY_RUNE_SETS: SetWithoutSize[] = [
  {
    runeId: 47467,
    name: "Призрачная руна яростного воина",
    tiers: [
      { count: 3, text: "Шанс критического удара в ближнем бою: +5%" },
      { count: 5, text: "Пробивание брони: +600 ед." },
    ],
  },
  {
    runeId: 47466,
    name: "Призрачная руна меткого стрелка",
    tiers: [
      { count: 3, text: "Шанс критического удара в дальнем бою: +5%" },
      { count: 5, text: "Пробивание брони: +600 ед." },
    ],
  },
  {
    runeId: 47464,
    name: "Призрачная руна могущественного мага",
    tiers: [
      { count: 3, text: "Шанс критического удара заклинанием: +5%" },
      { count: 5, text: "Игнорирование сопротивления: +600 ед." },
    ],
  },
  {
    runeId: 47465,
    name: "Призрачная руна искусного целителя",
    tiers: [
      { count: 3, text: "Шанс критического эффекта исцеления: +5%" },
      { count: 5, text: "Время применения умений: -4%" },
    ],
  },
];

const EPHEN_RUNE_SETS: SetWithoutSize[] = [
  {
    runeId: 43154,
    name: "Эфенская руна карающего огня",
    tiers: [
      { count: 3, text: "Тактическая подготовка: +506 ед." },
      { count: 4, text: FOUR_PIECE_TEXT },
      { count: 7, text: "Критический урон в ближнем бою: +25.3%" },
      {
        count: 8,
        text: `Пробивание брони: +641 ед.\n${EIGHT_PIECE_EXTRA_TEXT}`,
      },
    ],
  },
  {
    runeId: 43155,
    name: "Эфенская руна изначальных ветров",
    tiers: [
      { count: 3, text: "Тактическая подготовка: +506 ед." },
      { count: 4, text: FOUR_PIECE_TEXT },
      { count: 7, text: "Скорость передвижения: +7%" },
      {
        count: 8,
        text: `Шанс критического удара в дальнем бою: +9%\n${EIGHT_PIECE_EXTRA_TEXT}`,
      },
    ],
  },
  {
    runeId: 43156,
    name: "Эфенская руна земной тверди",
    tiers: [
      { count: 3, text: "Устойчивость к атакам в PvP: +452 ед." },
      { count: 4, text: FOUR_PIECE_TEXT },
      { count: 7, text: "Получаемый урон: -5.6%" },
      {
        count: 8,
        text: `Здоровье: +1333 ед.\n${EIGHT_PIECE_EXTRA_TEXT}`,
      },
    ],
  },
  {
    runeId: 43157,
    name: "Эфенская руна ледяных штормов",
    tiers: [
      { count: 3, text: "Устойчивость к атакам в PvP: +452 ед." },
      { count: 4, text: FOUR_PIECE_TEXT },
      { count: 7, text: "Доп. урон умений заклинаниями: +7%" },
      {
        count: 8,
        text: `Критический урон заклинаний: +28%\n${EIGHT_PIECE_EXTRA_TEXT}`,
      },
    ],
  },
  {
    runeId: 43158,
    name: "Эфенская руна вечной жизни",
    tiers: [
      { count: 3, text: "Устойчивость к атакам в PvP: +452 ед." },
      { count: 4, text: FOUR_PIECE_TEXT },
      { count: 7, text: "Шанс критического эффекта исцеления: +5%" },
      {
        count: 8,
        text: `Время применения умений: -8%\n${EIGHT_PIECE_EXTRA_TEXT}`,
      },
    ],
  },
  {
    runeId: 44000,
    name: "Эфенская руна искрящихся молний",
    tiers: [
      { count: 3, text: "Тактическая подготовка: +506 ед." },
      { count: 4, text: FOUR_PIECE_TEXT },
      { count: 7, text: "Скорость передвижения: +7%" },
      {
        count: 8,
        text: `Уклонение: +8%\n${EIGHT_PIECE_EXTRA_TEXT}`,
      },
    ],
  },
  {
    runeId: 44001,
    name: "Эфенская руна грозовых вихрей",
    tiers: [
      { count: 3, text: "Тактическая подготовка: +506 ед." },
      { count: 4, text: FOUR_PIECE_TEXT },
      { count: 7, text: "Сноровка: +70 ед." },
      {
        count: 8,
        text: `Урон в ближнем и дальнем бою: +6%\n${EIGHT_PIECE_EXTRA_TEXT}`,
      },
    ],
  },
  {
    runeId: 44002,
    name: "Эфенская руна неукротимого смерча",
    tiers: [
      { count: 3, text: "Устойчивость к атакам в PvP: +452 ед." },
      { count: 4, text: FOUR_PIECE_TEXT },
      { count: 7, text: "Получаемый урон: -5.6%" },
      {
        count: 8,
        text: `Сила заклинаний и эффективность исцеления: +6%\n${EIGHT_PIECE_EXTRA_TEXT}`,
      },
    ],
  },
];

const RUNE_SETS: RuneSet[] = [
  ...EPHEN_RUNE_SETS.map((set) => ({ ...set, size: EPHEN_SET_SIZE })),
  ...IFNIR_RUNE_SETS.map((set) => ({ ...set, size: IFNIR_SET_SIZE })),
  ...LIBRARY_RUNE_SETS.map((set) => ({ ...set, size: LIBRARY_SET_SIZE })),
];

export function findRuneSet(runeId: number): RuneSet | undefined {
  return RUNE_SETS.find((set) => set.runeId === runeId);
}
