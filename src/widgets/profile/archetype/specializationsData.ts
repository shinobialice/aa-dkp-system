// Специализации ArcheAge. Игровой класс собирается из 3 специализаций.
// Список взят из реального HTML калькулятора archeagecodex.com/ru/calc —
// специализаций всего 14 (id — data-clid): 12 "обычных" плюс Стрельба и
// Танец, которые в сочетаниях дают именные вариации уже существующих
// классов (см. classCombinations.ts). Иконки лежат в
// public/images/classes/<id>.png.
export type Specialization = {
  id: string;
  name: string;
  iconUrl: string;
};

export const SPECIALIZATIONS: Specialization[] = [
  { id: "napadenie", name: "Нападение", iconUrl: "/images/classes/napadenie.png" },
  { id: "volshebstvo", name: "Волшебство", iconUrl: "/images/classes/volshebstvo.png" },
  {
    id: "presledovanie",
    name: "Преследование",
    iconUrl: "/images/classes/presledovanie.png",
  },
  {
    id: "isceleine",
    name: "Исцеление",
    iconUrl: "/images/classes/isceleine.png",
  },
  {
    id: "misticizm",
    name: "Мистицизм",
    iconUrl: "/images/classes/misticizm.png",
  },
  { id: "skritnost", name: "Скрытность", iconUrl: "/images/classes/skritnost.png" },
  { id: "oborona", name: "Оборона", iconUrl: "/images/classes/oborona.png" },
  {
    id: "soprotivlenie",
    name: "Сопротивление",
    iconUrl: "/images/classes/soprotivlenie.png",
  },
  { id: "gipnoz", name: "Гипноз", iconUrl: "/images/classes/gipnoz.png" },
  {
    id: "voodush",
    name: "Воодушевление",
    iconUrl: "/images/classes/voodush.png",
  },
  { id: "gnev", name: "Гнев", iconUrl: "/images/classes/gnev.png" },
  { id: "kovarstvo", name: "Коварство", iconUrl: "/images/classes/kovarstvo.png" },
  { id: "strelba", name: "Стрельба", iconUrl: "/images/classes/strelba.png" },
  { id: "tanec", name: "Танец", iconUrl: "/images/classes/tanec.png" },
];

const specializationById = new Map(SPECIALIZATIONS.map((s) => [s.id, s]));

export function getSpecialization(
  id: string | null | undefined,
): Specialization | null {
  if (!id) return null;
  return specializationById.get(id) ?? null;
}

export function isValidSpecializationId(id: string): boolean {
  return specializationById.has(id);
}
