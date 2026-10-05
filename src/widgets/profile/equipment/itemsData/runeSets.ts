export type EphenRuneSetTier = {
  count: number;
  text: string;
};

export type EphenRuneSet = {
  runeId: number;
  name: string;
  tiers: EphenRuneSetTier[];
};

const FOUR_PIECE_TEXT = "Устойчивость к критическому урону: +560 ед.";
const EIGHT_PIECE_EXTRA_TEXT =
  "Дополнительный урон и эффективность исцеления при ношении двуручного оружия: +4.5%";

export const EPHEN_RUNE_SETS: EphenRuneSet[] = [
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
      { count: 7, text: "Дополнительный урон умений заклинаниями: +7%" },
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

export function findEphenRuneSet(runeId: number): EphenRuneSet | undefined {
  return EPHEN_RUNE_SETS.find((s) => s.runeId === runeId);
}
