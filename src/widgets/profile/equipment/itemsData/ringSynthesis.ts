export type RingSynthesisEffect = {
  id: number;
  label: string;
  value: number;
  isPercent: boolean;
};

// Пул случайных синтезируемых характеристик амальгамных Т4 ирамийских
// колец (обновление 6.2) — игрок выбирает 3 из 9 при синтезе кольца,
// заменить выбор можно ирамийской гадальной руной.
export const RING_SYNTHESIS_EFFECTS: RingSynthesisEffect[] = [
  { id: 1, label: "Пробивание брони", value: 1200, isPercent: false },
  { id: 2, label: "Игнорирование сопротивления", value: 1200, isPercent: false },
  { id: 3, label: "Снижение получаемого урона", value: 3.0, isPercent: true },
  { id: 4, label: "Устойчивость к критическому урону", value: 750, isPercent: false },
  { id: 5, label: "Устойчивость к атакам в PVP", value: 500, isPercent: false },
  { id: 6, label: "Доп. урон умений в ближнем бою", value: 3.5, isPercent: true },
  { id: 7, label: "Доп. урон умений в дальнем бою", value: 3.5, isPercent: true },
  { id: 8, label: "Доп. урон заклинаний", value: 3.5, isPercent: true },
  { id: 9, label: "Доп. эффективность исцеления", value: 3.5, isPercent: true },
];

export const RING_SYNTHESIS_SLOT_COUNT = 3;

// Т4 ирамийское кольцо обновления — Амальгамный перстень говорящего с духами.
const RING_SYNTHESIS_ITEM_IDS = new Set([48628]);

export function isRingSynthesisItem(itemId: number): boolean {
  return RING_SYNTHESIS_ITEM_IDS.has(itemId);
}

export function findRingSynthesisEffect(id: number): RingSynthesisEffect | undefined {
  return RING_SYNTHESIS_EFFECTS.find((e) => e.id === id);
}

export function isValidRingSynthesisEffectIds(
  itemId: number,
  ids: number[],
): boolean {
  if (ids.length === 0) return true;
  if (!isRingSynthesisItem(itemId)) return false;
  if (ids.length > RING_SYNTHESIS_SLOT_COUNT) return false;
  if (new Set(ids).size !== ids.length) return false;
  return ids.every((id) => RING_SYNTHESIS_EFFECTS.some((e) => e.id === id));
}
