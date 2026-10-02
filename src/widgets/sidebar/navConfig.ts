import {
  BadgeDollarSign,
  Calendar,
  CalendarDays,
  Gift,
  HandCoins,
  History,
  House,
  Info,
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

export type NavItem = { title: string; url: string; icon: LucideIcon };

export type NavSection = {
  title: string | null;
  items: NavItem[];
  adminOnly?: boolean;
  withDimonish?: boolean;
};

export const NAV_SECTIONS: NavSection[] = [
  {
    title: null,
    items: [
      { title: "Главная", url: "/", icon: House },
      { title: "Основная информация", url: "/news", icon: Info },
      { title: "Новости", url: "/game-news", icon: Newspaper },
      { title: "Доска объявлений", url: "/marketplace", icon: Megaphone },
    ],
  },
  {
    title: "Гильдия",
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
    items: [
      { title: "Казна", url: "/loot", icon: PiggyBank },
      { title: "Финансы", url: "/loot/finance", icon: HandCoins },
      { title: "Раздача лута", url: "/loot/giveaway", icon: Gift },
      { title: "Покупка лута", url: "/loot/buy", icon: BadgeDollarSign },
    ],
  },
  {
    title: "Киллкаунт α",
    items: [
      { title: "Сегодня", url: "/kill-counter/current", icon: Swords },
      { title: "История", url: "/kill-counter/history", icon: History },
    ],
  },
  {
    title: "Управление",
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
      url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(`${url}/`);
    if (matches && (!best || url.length > best.length)) best = url;
  }
  return best;
}
