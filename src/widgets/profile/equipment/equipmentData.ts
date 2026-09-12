export type EquipmentSlot = {
  key: string;
  label: string;
  category: "weapon" | "armor" | "accessory" | "other";
  iconUrl: string;
};

const SLOT_ICON = (n: number) => `/images/equipment/slots/slot${n}.png`;

export const EQUIPMENT_SLOTS: EquipmentSlot[] = [
  {
    key: "costume",
    label: "Костюм",
    category: "other",
    iconUrl: SLOT_ICON(1),
  },
  { key: "head", label: "Шлем", category: "armor", iconUrl: SLOT_ICON(2) },
  {
    key: "chest",
    label: "Нагрудник",
    category: "armor",
    iconUrl: SLOT_ICON(3),
  },
  { key: "belt", label: "Пояс", category: "armor", iconUrl: SLOT_ICON(4) },
  { key: "bracers", label: "Наручи", category: "armor", iconUrl: SLOT_ICON(5) },
  { key: "hands", label: "Перчатки", category: "armor", iconUrl: SLOT_ICON(6) },
  { key: "cloak", label: "Плащ", category: "armor", iconUrl: SLOT_ICON(7) },
  { key: "legs", label: "Поножи", category: "armor", iconUrl: SLOT_ICON(8) },
  { key: "feet", label: "Обувь", category: "armor", iconUrl: SLOT_ICON(9) },
  {
    key: "underwear",
    label: "Бельё",
    category: "other",
    iconUrl: SLOT_ICON(10),
  },
  {
    key: "necklace",
    label: "Ожерелье",
    category: "accessory",
    iconUrl: SLOT_ICON(11),
  },
  {
    key: "earring1",
    label: "Серьга 1",
    category: "accessory",
    iconUrl: SLOT_ICON(12),
  },
  {
    key: "earring2",
    label: "Серьга 2",
    category: "accessory",
    iconUrl: SLOT_ICON(13),
  },
  {
    key: "ring1",
    label: "Кольцо 1",
    category: "accessory",
    iconUrl: SLOT_ICON(14),
  },
  {
    key: "ring2",
    label: "Кольцо 2",
    category: "accessory",
    iconUrl: SLOT_ICON(15),
  },
  {
    key: "weapon_main",
    label: "Основное оружие",
    category: "weapon",
    iconUrl: SLOT_ICON(16),
  },
  {
    key: "weapon_off",
    label: "Доп. оружие",
    category: "weapon",
    iconUrl: SLOT_ICON(17),
  },
  {
    key: "weapon_ranged",
    label: "Дальнобойное оружие",
    category: "weapon",
    iconUrl: SLOT_ICON(18),
  },
  {
    key: "instrument",
    label: "Инструмент",
    category: "weapon",
    iconUrl: SLOT_ICON(19),
  },
];

export function isValidEquipmentSlot(slot: string): boolean {
  return EQUIPMENT_SLOTS.some((s) => s.key === slot);
}

export function getEquipmentSlot(key: string): EquipmentSlot | undefined {
  return EQUIPMENT_SLOTS.find((s) => s.key === key);
}
