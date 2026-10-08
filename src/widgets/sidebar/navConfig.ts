import {
  BadgeDollarSign,
  Calculator,
  Calendar,
  CalendarDays,
  Gift,
  HandCoins,
  History,
  House,
  Info,
  Lightbulb,
  LineChart,
  Megaphone,
  Newspaper,
  Package,
  PiggyBank,
  Settings,
  Swords,
  Users,
  UserX,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isNew?: boolean;
};

export type NavSection = {
  title: string | null;
  items: NavItem[];
  iconClassName: string;
  adminOnly?: boolean;
  withDimonish?: boolean;
};

export const NAV_SECTIONS: NavSection[] = [
  {
    title: null,
    iconClassName: "text-emerald-600 dark:text-emerald-400",
    items: [
      { title: "Главная", url: "/", icon: House },
      { title: "Основная информация", url: "/news", icon: Info },
      { title: "Полезная информация", url: "/useful-info", icon: Lightbulb },
      { title: "Новости", url: "/game-news", icon: Newspaper },
      { title: "Доска объявлений", url: "/marketplace", icon: Megaphone },
      {
        title: "Калькулятор сборок",
        url: "/calc",
        icon: Calculator,
        isNew: true,
      },
    ],
  },
  {
    title: "Гильдия",
    iconClassName: "text-sky-600 dark:text-sky-400",
    withDimonish: true,
    items: [
      { title: "Участники", url: "/members", icon: Users },
      { title: "Посещаемость", url: "/activities", icon: CalendarDays },
      { title: "Расписание", url: "/schedule", icon: Calendar },
      { title: "Статистика", url: "/stats", icon: LineChart },
    ],
  },
  {
    title: "Добыча",
    iconClassName: "text-amber-600 dark:text-amber-400",
    items: [
      { title: "Казна", url: "/loot", icon: PiggyBank },
      { title: "Финансы", url: "/loot/finance", icon: HandCoins },
      { title: "Раздача лута", url: "/loot/giveaway", icon: Gift },
      { title: "Покупка лута", url: "/loot/buy", icon: BadgeDollarSign },
    ],
  },
  {
    title: "Киллкаунт α",
    iconClassName: "text-rose-600 dark:text-rose-400",
    items: [
      { title: "Сегодня", url: "/kill-counter/current", icon: Swords },
      { title: "История", url: "/kill-counter/history", icon: History },
    ],
  },
  {
    title: "Управление",
    iconClassName: "text-slate-500 dark:text-slate-400",
    adminOnly: true,
    items: [
      { title: "Настройки", url: "/settings", icon: Settings },
      { title: "Предметы", url: "/items", icon: Package },
      { title: "АФК", url: "/afk", icon: UserX },
      { title: "Список изменений", url: "/changelog", icon: History },
    ],
  },
];

export const MOBILE_TABS: NavItem[] = [
  { title: "Главная", url: "/", icon: House },
  { title: "Расписание", url: "/schedule", icon: Calendar },
  { title: "Казна", url: "/loot", icon: PiggyBank },
  { title: "Участники", url: "/members", icon: Users },
];

export const ALL_NAV_URLS = NAV_SECTIONS.flatMap((section) =>
  section.items.map((item) => item.url),
);

export function findActiveUrl(pathname: string, urls: string[]) {
  let best: string | null = null;
  for (const url of urls) {
    const matches =
      url === "/"
        ? pathname === "/"
        : pathname === url || pathname.startsWith(`${url}/`);
    if (matches && (!best || url.length > best.length)) best = url;
  }
  return best;
}
