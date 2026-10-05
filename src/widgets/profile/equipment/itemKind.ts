import { ARMOR_TYPE, type ArmorWeight } from "./itemsData/armorType";
import { WEAPON_KIND } from "./itemsData/weaponKind";

const ARMOR_KIND: Record<ArmorWeight, string> = {
  light: "Легкий доспех",
  medium: "Средний доспех",
  heavy: "Тяжелый доспех",
};

const SLOT_KIND: Record<string, string> = {
  necklace: "Ожерелье",
  earring1: "Серьга",
  earring2: "Серьга",
  ring1: "Кольцо",
  ring2: "Кольцо",
  costume: "Универсальный костюм",
  underwear: "Универсальное белье",
};

export function getItemKind(
  slotKey: string,
  itemId: number,
): string | undefined {
  const weight = ARMOR_TYPE[itemId];
  if (weight) return ARMOR_KIND[weight];
  return WEAPON_KIND[itemId] ?? SLOT_KIND[slotKey];
}
