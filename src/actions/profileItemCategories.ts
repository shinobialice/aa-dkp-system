// Список категорий отдельно от profileItemTypeAdmin.ts ("use server") —
// файл с "use server" может экспортировать только async-функции, а
// PROFILE_ITEM_CATEGORIES нужен как обычный массив-константа (валидация в
// createProfileItemType/updateProfileItemType).
//
// Категории жёстко ограничены вкладками, зашитыми в InventoryTabsClient —
// свободный ввод новой категории сломал бы вкладки. "Другое" — основная
// категория для кастомных предметов, выбираемых в профиле (см.
// AddCustomInventoryItemDialog); Техника/Глайдеры/Петы — по умолчанию
// фиксированный список из InventoryItems.tsx, но можно дополнить и его.
export const PROFILE_ITEM_CATEGORIES = [
  "Техника",
  "Глайдеры",
  "Петы",
  "Другое",
] as const;
export type ProfileItemCategory = (typeof PROFILE_ITEM_CATEGORIES)[number];
