import type { GearItem } from "./types";

// Иконки для этого набора — локальные ассеты игры
// (public/images/equipment/items/underwear/nu_f_in_pants_*.png).
const NU_ICON = (name: string) =>
  `/images/equipment/items/underwear/nu_f_in_pants_${name}.png`;

export const UNDERWEAR_ITEMS: GearItem[] = [
  { id: 8002571, name: "Универсальное белье «Снежный ноктюрн» для бойца", grade: 1, iconUrl: NU_ICON("melee"), sealIconUrl: null },
  { id: 8002572, name: "Универсальное белье «Снежный ноктюрн» для лучника", grade: 1, iconUrl: NU_ICON("archer"), sealIconUrl: null },
  { id: 8002573, name: "Универсальное белье «Снежный ноктюрн» для чародея", grade: 1, iconUrl: NU_ICON("mage"), sealIconUrl: null },
  { id: 8002574, name: "Универсальное белье «Снежный ноктюрн» для лекаря", grade: 1, iconUrl: NU_ICON("heal"), sealIconUrl: null },
];
