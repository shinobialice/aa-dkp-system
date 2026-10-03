export const CLASS_ORDER = [
  "Бард",
  "Лук",
  "Стрелок",
  "Маг",
  "Милик",
  "Тактик",
  "Танцор",
  "Хил",
];

const CLASS_PLURAL: Record<string, string> = {
  Бард: "Барды",
  Лук: "Луки",
  Стрелок: "Стрелки",
  Маг: "Маги",
  Милик: "Милики",
  Тактик: "Тактики",
  Танцор: "Танцоры",
  Хил: "Хилы",
};

export type ClassGroup<T> = {
  cls: string | null;
  title: string;
  items: T[];
};

export function classGroupTitle(cls: string | null) {
  if (!cls) return "Без класса";
  return CLASS_PLURAL[cls] ?? cls;
}

export function groupByClass<T>(
  items: T[],
  classOf: (item: T) => string | null,
): ClassGroup<T>[] {
  return [...CLASS_ORDER, null]
    .map((cls) => ({
      cls,
      title: classGroupTitle(cls),
      items: items.filter((item) => belongsToClass(classOf(item), cls)),
    }))
    .filter((group) => group.items.length > 0);
}

function belongsToClass(itemClass: string | null, cls: string | null) {
  if (cls !== null) return itemClass === cls;
  return !itemClass || !CLASS_ORDER.includes(itemClass);
}
