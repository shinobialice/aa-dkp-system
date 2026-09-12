import type { GearItem } from "./types";
import { ITEM_ICON, SEAL_ICON } from "./paths";

export const COSTUME_ITEMS: GearItem[] = [
  { id: 8002454, name: "Невидимый костюм бойца", grade: 1, iconUrl: ITEM_ICON("costume", "невидимый_костюм_бойца"), sealIconUrl: null },
  { id: 8002455, name: "Невидимый костюм лучника", grade: 1, iconUrl: ITEM_ICON("costume", "невидимый_костюм_лучника"), sealIconUrl: null },
  { id: 8002456, name: "Невидимый костюм чародея", grade: 1, iconUrl: ITEM_ICON("costume", "невидимый_костюм_чародея"), sealIconUrl: null },
  { id: 8002457, name: "Невидимый костюм лекаря", grade: 1, iconUrl: ITEM_ICON("costume", "невидимый_костюм_лекаря"), sealIconUrl: null },
];
