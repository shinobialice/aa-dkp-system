import {
  Bell,
  Box,
  HandCoins,
  House,
  KeyRound,
  MapPin,
  PartyPopper,
  Swords,
  UserCog,
  type LucideIcon,
} from "lucide-react";

export type SectionId =
  | "overview"
  | "access"
  | "self"
  | "guild"
  | "event"
  | "points"
  | "salary"
  | "vk"
  | "inventory";

export type SettingsSection = {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const SECTION_GROUPS: { title: string; sections: SettingsSection[] }[] =
  [
    {
      title: "",
      sections: [
        {
          id: "overview",
          label: "Сводка",
          icon: House,
          description:
            "Что сейчас настроено. Нажмите на плитку, чтобы перейти к настройке.",
        },
      ],
    },
    {
      title: "Люди",
      sections: [
        {
          id: "access",
          label: "Доступ и вход",
          icon: KeyRound,
          description:
            "Ссылка для входа нужна, если игрок не может войти через VK, Google или Mail.ru.",
        },
        {
          id: "self",
          label: "Что игроки меняют сами",
          icon: UserCog,
          description:
            "Какие поля активные игроки могут править в своём профиле без администратора.",
        },
      ],
    },
    {
      title: "Гильдия",
      sections: [
        {
          id: "guild",
          label: "Статус гильдии",
          icon: MapPin,
          description:
            "Сервер и фракция видны всем в шапке и меню. Режим влияет на очки боссов и статистику войны.",
        },
        {
          id: "event",
          label: "Ивент и проф. работы",
          icon: PartyPopper,
          description: "Баннер ивента на главной и окна профилактики.",
        },
      ],
    },
    {
      title: "Экономика",
      sections: [
        {
          id: "points",
          label: "Баллы за посещаемость",
          icon: Swords,
          description: "Очки за боссов и бонусы за посещаемость.",
        },
        {
          id: "salary",
          label: "Зарплата",
          icon: HandCoins,
          description: "Кто получает зарплату.",
        },
      ],
    },
    {
      title: "Оповещения",
      sections: [
        {
          id: "vk",
          label: "Уведомления ВК",
          icon: Bell,
          description:
            "Сообщения ВК-бота о скором начале боссов и рейдов — отдельно от звуковых оповещений в браузере.",
        },
      ],
    },
    {
      title: "Данные",
      sections: [
        {
          id: "inventory",
          label: "Статистика инвентаря",
          icon: Box,
          description:
            "Какие предметы игроков показывать на «Статистике» во вкладке «Предметы».",
        },
      ],
    },
  ];

export const SECTIONS = SECTION_GROUPS.flatMap((group) => group.sections);

export const sectionById = (id: SectionId) =>
  SECTIONS.find((section) => section.id === id)!;

export const isSectionId = (value: string): value is SectionId =>
  SECTIONS.some((section) => section.id === value);

/** Что можно найти поиском «Найти настройку…». */
export const SEARCH_INDEX: {
  section: SectionId;
  label: string;
  keywords?: string;
}[] = [
  {
    section: "access",
    label: "Ссылка для входа",
    keywords: "токен привязка войти логин",
  },
  {
    section: "access",
    label: "Новый игрок",
    keywords: "создать пользователя добавить",
  },
  { section: "self", label: "Ник", keywords: "профиль сам" },
  { section: "self", label: "ГС", keywords: "профиль сам гир" },
  { section: "self", label: "VK", keywords: "профиль сам вк" },
  { section: "self", label: "Инвентарь", keywords: "профиль сам" },
  { section: "self", label: "Печати", keywords: "профиль сам" },
  {
    section: "self",
    label: "Класс (специализации)",
    keywords: "профиль сам архетип",
  },
  { section: "self", label: "Экипировка", keywords: "профиль сам" },
  { section: "self", label: "Доп. роли", keywords: "профиль сам" },
  { section: "guild", label: "Сервер", keywords: "статус шапка" },
  {
    section: "guild",
    label: "Фракция",
    keywords: "запад восток нуиан харихаран",
  },
  { section: "guild", label: "Режим ПВП / Фришка", keywords: "вар война pvp" },
  { section: "event", label: "Ивент", keywords: "баннер главная" },
  { section: "event", label: "Картинка баннера", keywords: "ивент" },
  {
    section: "event",
    label: "Проф. работы",
    keywords: "профилактика окно техработы",
  },
  { section: "points", label: "Очки боссов", keywords: "dkp дкп баллы" },
  {
    section: "points",
    label: "Бонусы за посещаемость",
    keywords: "баллы множитель",
  },
  {
    section: "salary",
    label: "Порог посещаемости праймов",
    keywords: "зарплата зп",
  },
  { section: "salary", label: "Порог баллов", keywords: "зарплата зп" },
  {
    section: "salary",
    label: "Тег ДВ обходит пороги",
    keywords: "зарплата зп",
  },
  { section: "salary", label: "Порог ГС", keywords: "зарплата зп гс" },
  { section: "vk", label: "Прайм", keywords: "вк бот уведомление время дни" },
  { section: "vk", label: "Плавающие боссы", keywords: "вк бот уведомление" },
  { section: "vk", label: "Расписание", keywords: "вк бот уведомление" },
  { section: "vk", label: "Тихие часы", keywords: "вк бот ночь online all" },
  {
    section: "inventory",
    label: "Имеющиеся предметы",
    keywords: "статистика инвентарь",
  },
];
