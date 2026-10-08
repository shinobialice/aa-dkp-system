import type { SectionId } from "./settingsSections";

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
  {
    section: "guildBuffs",
    label: "Гильдейские баффы",
    keywords:
      "бафф неукротимая ярость истинное призвание жизненная сила легкий шаг стремление к совершенству крепкая броня",
  },
  { section: "event", label: "Ивент", keywords: "баннер главная" },
  { section: "event", label: "Картинка баннера", keywords: "ивент" },
  {
    section: "event",
    label: "Страница ивента",
    keywords: "промо promo марафон меню",
  },
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
