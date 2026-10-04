import {
  Bell,
  Box,
  HandCoins,
  House,
  KeyRound,
  MapPin,
  PartyPopper,
  Sparkles,
  Swords,
  UserCog,
  type LucideIcon,
} from "lucide-react";

export type SectionId =
  | "overview"
  | "access"
  | "self"
  | "guild"
  | "guildBuffs"
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
          id: "guildBuffs",
          label: "Гильдейские баффы",
          icon: Sparkles,
          description:
            "Уровни гильдейских баффов. Учитываются в характеристиках экипировки у всех игроков.",
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

export function sectionById(id: SectionId) {
  const section = SECTIONS.find((candidate) => candidate.id === id);
  if (!section) throw new Error(`Неизвестный раздел настроек: ${id}`);
  return section;
}

export const isSectionId = (value: string): value is SectionId =>
  SECTIONS.some((section) => section.id === value);
