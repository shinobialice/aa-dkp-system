import { BadgeDollarSign, Gift, HandCoins } from "lucide-react";

export const RELATED = [
  { title: "Покупка лута", url: "/loot/buy", icon: BadgeDollarSign },
  { title: "Раздача лута", url: "/loot/giveaway", icon: Gift },
  { title: "Финансы", url: "/loot/finance", icon: HandCoins },
];

export const FACTS = [
  {
    value: "70 / 30",
    text: "заработка гильдии: на зарплаты / в казну",
    ref: "п. 3.1",
    href: "#rules-3",
  },
  {
    value: "≈30%",
    text: "скидка своим на лут с праймов и АГЛ",
    ref: "п. 4.3",
    href: "#rules-4",
  },
  {
    value: "до 20-го",
    text: "вступил — испытательный срок кончится 1-го числа",
    ref: "п. 1.1",
    href: "#rules-1",
  },
  {
    value: "50–100 тыс.",
    text: "голды разово на спек тактика, барда или танцора",
    ref: "п. 5.3",
    href: "#rules-5",
  },
];

export const PENALTY_STEPS = [1, 3, 5, 10, 15];
export const PENALTY_ALL = 21;
