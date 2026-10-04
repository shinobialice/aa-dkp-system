// Иконки предметов лежат по слотам: public/images/equipment/items/<slot>/<slug>.jpg,
// имя файла — транслитерация названия предмета, не числовой id.
export const ITEM_ICON = (slot: string, slug: string) =>
  `/images/equipment/items/${slot}/${slug}.jpg`;
export const SEAL_ICON = (file: string) =>
  `/images/equipment/seals/${file}.png`;

const OVERLAYS_WITHOUT_CUBE_MARK: Record<string, string | null> = {
  [SEAL_ICON("top_thiol_1")]: null,
  [SEAL_ICON("top_thiol_6")]: SEAL_ICON("top_seal_ipnir_4"),
};

export function getItemOverlayUrl(sealIconUrl: string | null | undefined) {
  if (!sealIconUrl) return null;
  return sealIconUrl in OVERLAYS_WITHOUT_CUBE_MARK
    ? OVERLAYS_WITHOUT_CUBE_MARK[sealIconUrl]
    : sealIconUrl;
}

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
