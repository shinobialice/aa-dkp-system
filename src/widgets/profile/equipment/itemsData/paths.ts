// Иконки предметов лежат по слотам: public/images/equipment/items/<slot>/<slug>.jpg,
// имя файла — транслитерация названия предмета, не числовой id.
export const ITEM_ICON = (slot: string, slug: string) =>
  `/images/equipment/items/${slot}/${slug}.jpg`;
export const SEAL_ICON = (file: string) => `/images/equipment/seals/${file}.png`;

const GRADE_FILES = [
  "Basic",
  "Grand",
  "Rare",
  "Arcane",
  "Heroic",
  "Unique",
  "Celestial",
  "Divine",
  "Epic",
  "Legendary",
  "Mythic",
  "Eternal",
];

export function getItemGradeIconUrl(grade: number): string {
  const file = GRADE_FILES[grade - 1] ?? GRADE_FILES[0];
  return `/images/equipment/grades/item_grade_${file}.png`;
}
