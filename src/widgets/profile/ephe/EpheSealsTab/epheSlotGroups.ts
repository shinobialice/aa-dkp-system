export const EPHE_SLOT_SHORT_LABELS: Record<string, string> = {
  weapon_main: "Правая рука",
  weapon_off: "Левая рука",
  weapon_ranged: "Дальний бой",
  head: "Шлем",
  chest: "Нагрудник",
  legs: "Поножи",
  hands: "Перчатки",
  feet: "Сапоги",
  belt: "Пояс",
  bracers: "Наручи",
  necklace: "Ожерелье",
  earring1: "Серьга (левая)",
  earring2: "Серьга (правая)",
  ring1: "Кольцо (левое)",
  ring2: "Кольцо (правое)",
  instrument: "Инструмент",
};

export const EPHE_SIDEBAR_GROUPS: { label: string; slots: string[] }[] = [
  {
    label: "Печать Эфе (оружие)",
    slots: ["weapon_main", "weapon_off", "weapon_ranged"],
  },
  {
    label: "Печать Эфе (доспехи)",
    slots: ["head", "chest", "legs", "hands", "feet", "belt", "bracers"],
  },
  {
    label: "Печать Эфе (украшения)",
    slots: ["necklace", "earring1", "earring2", "ring1", "ring2", "instrument"],
  },
];

export const TIER_LABELS = {
  default: "РБ",
  ephen: "Эфенское",
  ramian: "Рамианское/данж.",
};
