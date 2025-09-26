const BASE_URL = "https://archeagecodex.com/items/icon_item_";
const GRADE_URL = "https://archeagecodex.com/images/icon_grade";

const LootGrade: { [key: string]: number } = {
  "Средоточие безумия": 5,
  "Фрагмент чешуи Ашьяры": 5,
  "Средоточие ярости": 5,
  "Клык Калидиса": 7,
  "Лоскут кожи Калидиса": 6,
  "Эссенция ужаса": 5,
  "Генетический материал дракона": 5,
  "Эссенция гнева": 5,
  "Средоточие сумрака": 5,
  "Эссенция кошмара": 5,
  "Средоточие морей": 5,
  "Глаз Левиафана": 6,
  "Каменное сердце Морфеоса": 5,
  "Эссенция ярости": 5,
  "Трофейная эссенция стихий": 12,
  "Свиток пробудившихся мифов": 6,
  "Свиток пробуждения драконоборца": 5,
  "Кристалл властелина морей": 7,
};

export const LootIcons: { [key: string]: string | number } = {
  "Другое": 4383,
  "Глайдер «Крылья небесного стража»": 4312,
  "Аметистовая гравировка северной звезды": 4190,
  "Средоточие безумия": 4773,
  "Фрагмент чешуи Ашьяры": 1957,
  "Ташш, змеиное жало":
    "https://archeagecodex.com/items/icon_item_blade_1h_0103.png",
  "Нирах, искушающий":
    "https://archeagecodex.com/items/icon_item_staff_1h_0105.png",
  "Ишхар, грань измерений":
    "https://archeagecodex.com/items/icon_item_sword_2h_0087.png",
  "Гирра, пробивающий брешь":
    "https://archeagecodex.com/items/icon_item_axe_2h_0070.png",
  "Джераб, слуга смерти":
    "https://archeagecodex.com/items/icon_item_shotgun_0054.png",
  "Нерхал, бронзовая чешуя":
    "https://archeagecodex.com/items/icon_item_shield_0118.png",
  "Шлем любимца Изы":
    "https://archeagecodex.com/items/costume_hm/nu_m_hm_leather277.png",
  "Доспех любимца Изы":
    "https://archeagecodex.com/items/costume_ar/nu_f_ar_leather277.png",
  "Перчатки любимца Изы":
    "https://archeagecodex.com/items/costume_gv/nu_f_gv_leather277.png",
  "Поножи любимца Изы":
    "https://archeagecodex.com/items/costume_pt/nu_f_pt_leather277.png",
  "Сапоги любимца Изы":
    "https://archeagecodex.com/items/costume_bo/nu_f_bo_leather277.png",
  "Плащ проклятой души":
    "https://archeagecodex.com/items/costume_cp/nu_m_cp_leather277.png",
  "Средоточие ярости": 4772, //+рамка //archeagecodex.com/images/icon_grade5.png
  "Клык Калидиса": 4812,
  "Аст'аджал, Длань судьбы":
    "https://archeagecodex.com/items/icon_item_spear_2h_0041.png",
  "Анд'хакар, Чернильная тьма":
    "https://archeagecodex.com/items/icon_item_shield_0055.png",
  "Ро'кана, Безумие морей":
    "https://archeagecodex.com/items/icon_item_staff_1h_0058.png",
  "Глайдер охотника на драконов": 1205,
  "Эссенция ужаса": 5003,
  "Дра'кордис, Сердце дракона": 4540,
  "Рави’мар, Драконья ярость": 4541,
  "Мор’гур, Смерть драконов": 4544,
  "Вул’данор, Клеймитель драконов": 4545,
  "Дра'орис, Дыхание дракона":
    "https://archeagecodex.com/items/icon_item_shotgun_0053.png",
  "Иг'нис, Пламя возмездия": 4543,
  "Драго’ран, Гнев Гартарейн": 4542,
  "Глайдер «Рассекатель небес»": 1369,
  "Генетический материал дракона": 4260, //+рамка //archeagecodex.com/images/icon_grade5.png
  "Эссенция гнева": 5001, //+рамка //archeagecodex.com/images/icon_grade5.png
  "Средоточие сумрака": 4771, //+рамка //archeagecodex.com/images/icon_grade5.png
  "Шлем властелина морей":
    "https://archeagecodex.com/items/costume_hm/nu_m_hm_metal179.png",
  "Бригантина властелина морей":
    "https://archeagecodex.com/items/costume_ar/nu_f_ar_metal179.png",
  "Перчатки властелина морей":
    "https://archeagecodex.com/items/costume_gv/nu_m_gv_metal179.png",
  "Поножи властелина морей":
    "https://archeagecodex.com/items/costume_pt/nu_m_pt_metal179.png",
  "Сапоги властелина морей":
    "https://archeagecodex.com/items/costume_bo/nu_f_bo_metal179.png",
  "Эссенция кошмара": 5002, //+рамка //archeagecodex.com/images/icon_grade5.png
  "Средоточие морей": 4770, //+рамка //archeagecodex.com/images/icon_grade5.png
  "Глаз Левиафана": "https://archeagecodex.com/items/icon_item_0184.png", //+рамка //archeagecodex.com/images/icon_grade6.png
  "Каменное сердце Морфеоса":
    "https://archeagecodex.com/items/quest/icon_item_quest028.png",
  "Эссенция ярости": 4687, //+рамка //archeagecodex.com/images/icon_grade5.png
  "Трофейная эссенция стихий": 3094, //+рамка //archeagecodex.com/images/icon_grade12.png
  "Свиток пробудившихся мифов": 4893, //+рамка //archeagecodex.com/images/icon_grade6.png
  "Свиток пробуждения драконоборца": 4446, //+рамка //archeagecodex.com/images/icon_grade5.png
  "Акхиумная сфера": 4790,
  "Акхиумный раствор": 4457,
  "Эссенция звездного акхиума":
    "https://archeagecodex.com/items/icon_item_0371.png",
  "Кристалл властелина морей": 4768, //+рамка //archeagecodex.com/images/icon_grade7.png
  "Капюшон иферийского советника":
    "https://archeagecodex.com/items/nu_f_hm_cloth185.png",
  "Мантия иферийского советника":
    "https://archeagecodex.com/items/nu_f_ar_cloth185.png",
  "Перчатки иферийского советника":
    "https://archeagecodex.com/items/nu_f_gv_cloth185.png",
  "Поножи иферийского советника":
    "https://archeagecodex.com/items/nu_f_pt_cloth185.png",
  "Сапоги иферийского советника":
    "https://archeagecodex.com/items/nu_f_bo_cloth185.png",
  "Лоскут кожи Калидиса": 4813,
};

export function getLootIconUrl(itemName: string): string {
  const value = LootIcons[itemName];
  if (!value) {
    return "/icons/placeholder.png";
  }
  if (typeof value === "number") {
    return `${BASE_URL}${value}.png`;
  }
  return value;
}

export function getLootGradeUrl(itemName: string): string {
  const grade = LootGrade[itemName] || 1;
  return `${GRADE_URL}${grade}.png`;
}
