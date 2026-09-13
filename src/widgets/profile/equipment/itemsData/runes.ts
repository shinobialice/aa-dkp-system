import type { WeaponHandedness } from "./weaponHandedness";

export type Rune = {
  id: number;
  name: string;
  grade: number;
  iconUrl: string;
  effect: string | null;
  slots: string[];
  restrictedToItemIds?: number[];
};

const EPHEN_ITEM_IDS = [
  54953, 54954, 54955, 54956, 54957, 54958, 54959, 54960, 54961, 54962, 54963,
  54964, 54965, 54966, 54967, 54968, 54969, 54970, 54971, 54972, 54973, 54974,
  54975, 54976, 54977, 54978, 54979, 54980, 54981, 54982, 54983, 54984, 54985,
  54986, 54987, 54988, 54994, 54995, 54996, 54997, 54998, 54999, 55000, 55001,
  55002, 55003, 55004, 55005, 55006, 55007, 55008, 55009, 55010, 55011, 55012,
  55013, 55014, 55015, 55016, 55017, 55018, 55019, 55020, 55021, 55022, 55023,
  55024, 55025, 55026, 55027, 55028, 55029, 55030, 55037, 55038, 55039, 55040,
  55041, 55042, 55043, 55044, 55045, 55046, 55047, 55048, 55049, 55050, 55051,
  55052, 55053, 55054, 55055, 55056, 55057, 55058, 55059, 55060, 55061, 55062,
  55063, 55064, 55065, 55066, 55067, 55068, 55069, 55070, 55071, 55072, 55073,
  55079, 55080, 55081, 55082, 55083, 55084, 55085, 55086, 55087, 55088, 55089,
  55090, 55091, 55092, 55093, 55094, 55095, 55096, 55097, 55098, 55099, 55100,
  55101, 55102, 55103, 55104, 55105, 55106, 55107, 55108, 55109, 55110, 55111,
  55112, 55113, 55114, 55115, 55121,
];

const EPHEN_RUNE_SLOTS = [
  "head",
  "chest",
  "belt",
  "bracers",
  "hands",
  "legs",
  "feet",
  "one_handed",
  "two_handed",
  "shield",
  "ranged",
];

const RUNE_ICON = (slug: string) =>
  `/images/equipment/runes/${slug}.jpg`;

export const RUNES: Rune[] = [
  { id: 55762, name: "Ледяная руна", grade: 12, iconUrl: RUNE_ICON("ледяная_руна_55762"), effect: null, slots: ["costume"] },
  { id: 55767, name: "Ледяная руна", grade: 11, iconUrl: RUNE_ICON("ледяная_руна_55767"), effect: null, slots: ["costume"] },
  { id: 55766, name: "Ледяная руна", grade: 10, iconUrl: RUNE_ICON("ледяная_руна_55766"), effect: null, slots: ["costume"] },
  { id: 55765, name: "Ледяная руна", grade: 9, iconUrl: RUNE_ICON("ледяная_руна_55765"), effect: null, slots: ["costume"] },
  { id: 55764, name: "Ледяная руна", grade: 8, iconUrl: RUNE_ICON("ледяная_руна_55764"), effect: null, slots: ["costume"] },
  { id: 8001843, name: "Руна вечного странника", grade: 8, iconUrl: RUNE_ICON("руна_вечного_странника_8001843"), effect: "Каждый раз, когда вы атакуете противника, его защита и сопротивление заклинаниям понижаются на 60 ед. Эффект суммируется до 7 раз.", slots: ["costume"] },
  { id: 8001845, name: "Руна жреца Пантеона", grade: 8, iconUrl: RUNE_ICON("руна_жреца_пантеона_8001845"), effect: "Каждый раз, когда вас атакуют, получаемый урон снижается на 0.3%. Эффект суммируется до 7 раз.", slots: ["costume"] },
  { id: 8001463, name: "Руна змееуста", grade: 8, iconUrl: RUNE_ICON("руна_змееуста_8001463"), effect: "Каждый раз, когда вас атакуют, защита и сопротивление заклинаниям повышаются на 60 ед. / Эффект суммируется до 7 раз.", slots: ["costume"] },
  { id: 8001846, name: "Руна мстителя Соколиной Тени", grade: 8, iconUrl: RUNE_ICON("руна_мстителя_соколиной_тени_8001846"), effect: "Каждый раз, когда вы атакуете, шанс критического удара в ближнем бою, дальнем бою и заклинаниями, а также шанс критического эффекта исцеления повышаются на 0.5%. Эффект суммируется до 7 раз.", slots: ["costume"] },
  { id: 8001844, name: "Руна стража Крепости Ели", grade: 8, iconUrl: RUNE_ICON("руна_стража_крепости_ели_8001844"), effect: "Каждый раз, когда вас атакуют, восприимчивость к исцелению повышается на 0.7%. Эффект суммируется до 7 раз.", slots: ["costume"] },
  { id: 8001898, name: "Руна чиалайя", grade: 8, iconUrl: RUNE_ICON("руна_чиалайя_8001898"), effect: "Каждый раз, когда вы атакуете противника, показатель сноровки повышается на 4 ед. Эффект суммируется до 7 раз.", slots: ["costume"] },
  { id: 55262, name: "Легендарная руна ифнирского бойца", grade: 6, iconUrl: RUNE_ICON("легендарная_руна_ифнирского_бойца_55262"), effect: "Устойчивость к критическому урону: +150 ед. / Сила атаки в ближнем бою: +15 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55277, name: "Легендарная руна ифнирского лекаря", grade: 6, iconUrl: RUNE_ICON("легендарная_руна_ифнирского_лекаря_55277"), effect: "Устойчивость к критическому урону: +150 ед. / Эффективность исцеления: +15 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55267, name: "Легендарная руна ифнирского лучника", grade: 6, iconUrl: RUNE_ICON("легендарная_руна_ифнирского_лучника_55267"), effect: "Устойчивость к критическому урону: +150 ед. / Сила атаки в дальнем бою: +15 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55272, name: "Легендарная руна ифнирского чародея", grade: 6, iconUrl: RUNE_ICON("легендарная_руна_ифнирского_чародея_55272"), effect: "Устойчивость к критическому урону: +150 ед. / Сила заклинаний: +15 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 47465, name: "Призрачная руна искусного целителя", grade: 6, iconUrl: RUNE_ICON("призрачная_руна_искусного_целителя_47465"), effect: "Эффективность исцеления: +15 ед.", slots: ["belt", "bracers", "feet", "hands", "legs"] },
  { id: 47466, name: "Призрачная руна меткого стрелка", grade: 6, iconUrl: RUNE_ICON("призрачная_руна_меткого_стрелка_47466"), effect: "Сила атаки в дальнем бою: +15 ед.", slots: ["belt", "bracers", "feet", "hands", "legs"] },
  { id: 47464, name: "Призрачная руна могущественного мага", grade: 6, iconUrl: RUNE_ICON("призрачная_руна_могущественного_мага_47464"), effect: "Сила заклинаний: +15 ед.", slots: ["belt", "bracers", "feet", "hands", "legs"] },
  { id: 47467, name: "Призрачная руна яростного воина", grade: 6, iconUrl: RUNE_ICON("призрачная_руна_яростного_воина_47467"), effect: "Сила атаки в ближнем бою: +15 ед.", slots: ["belt", "bracers", "feet", "hands", "legs"] },
  { id: 38513, name: "Хрустальная руна багровой луны", grade: 6, iconUrl: RUNE_ICON("хрустальная_руна_багровой_луны_38513"), effect: "Сила: +15 ед.", slots: ["underwear"] },
  { id: 38517, name: "Хрустальная руна безмолвной луны", grade: 6, iconUrl: RUNE_ICON("хрустальная_руна_безмолвной_луны_38517"), effect: "Сила духа: +15 ед.", slots: ["underwear"] },
  { id: 38516, name: "Хрустальная руна колдовской луны", grade: 6, iconUrl: RUNE_ICON("хрустальная_руна_колдовской_луны_38516"), effect: "Интеллект: +15 ед.", slots: ["underwear"] },
  { id: 38515, name: "Хрустальная руна молодой луны", grade: 6, iconUrl: RUNE_ICON("хрустальная_руна_молодой_луны_38515"), effect: "Выносливость: +15 ед.", slots: ["underwear"] },
  { id: 38514, name: "Хрустальная руна осенней луны", grade: 6, iconUrl: RUNE_ICON("хрустальная_руна_осенней_луны_38514"), effect: "Ловкость: +15 ед.", slots: ["underwear"] },
  { id: 55261, name: "Эпическая руна ифнирского бойца", grade: 5, iconUrl: RUNE_ICON("эпическая_руна_ифнирского_бойца_55261"), effect: "Устойчивость к критическому урону: +90 ед. / Сила атаки в ближнем бою: +9 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55276, name: "Эпическая руна ифнирского лекаря", grade: 5, iconUrl: RUNE_ICON("эпическая_руна_ифнирского_лекаря_55276"), effect: "Устойчивость к критическому урону: +90 ед. / Эффективность исцеления: +9 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55266, name: "Эпическая руна ифнирского лучника", grade: 5, iconUrl: RUNE_ICON("эпическая_руна_ифнирского_лучника_55266"), effect: "Устойчивость к критическому урону: +90 ед. / Сила атаки в дальнем бою: +9 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55271, name: "Эпическая руна ифнирского чародея", grade: 5, iconUrl: RUNE_ICON("эпическая_руна_ифнирского_чародея_55271"), effect: "Устойчивость к критическому урону: +90 ед. / Сила заклинаний: +9 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 26858, name: "Лунный бриллиант зыбких чар", grade: 4, iconUrl: RUNE_ICON("лунный_бриллиант_зыбких_чар_26858"), effect: "С каждой атакой показатель интеллекта увеличивается на 4 ед. / Эффект суммируется до 5 раз. / При максимальном эффекте сила заклинаний дополнительно повышается на 3 ед. / Эффект срабатывает не чаще одного раза в 2 сек.", slots: ["cloak"] },
  { id: 26855, name: "Лунный бриллиант мощи", grade: 4, iconUrl: RUNE_ICON("лунный_бриллиант_мощи_26855"), effect: "С каждой атакой показатель силы увеличивается на 4 ед. / Эффект суммируется до 5 раз. / При максимальном эффекте сила атаки дополнительно повышается на 3 ед. / Эффект срабатывает не чаще одного раза в 2 сек.", slots: ["cloak"] },
  { id: 26857, name: "Лунный бриллиант надежды", grade: 4, iconUrl: RUNE_ICON("лунный_бриллиант_надежды_26857"), effect: "Выносливость: +10 ед.", slots: ["cloak"] },
  { id: 26859, name: "Лунный бриллиант озарения", grade: 4, iconUrl: RUNE_ICON("лунный_бриллиант_озарения_26859"), effect: "Сила духа: +10 ед.", slots: ["cloak"] },
  { id: 26856, name: "Лунный бриллиант теней", grade: 4, iconUrl: RUNE_ICON("лунный_бриллиант_теней_26856"), effect: "С каждой атакой показатель ловкости увеличивается на 4 ед. / Эффект суммируется до 5 раз. / При максимальном эффекте сила атаки дополнительно повышается на 3 ед. / Эффект срабатывает не чаще одного раза в 2 сек.", slots: ["cloak"] },
  { id: 14716, name: "Ослепительная руна багрового полумесяца", grade: 4, iconUrl: RUNE_ICON("ослепительная_руна_багрового_полумесяца_14716"), effect: "Сила: +9 ед.", slots: ["belt", "bracers", "chest", "feet", "hands", "head", "legs", "underwear"] },
  { id: 14755, name: "Ослепительная руна изумрудного полумесяца", grade: 4, iconUrl: RUNE_ICON("ослепительная_руна_изумрудного_полумесяца_14755"), effect: "Выносливость: +9 ед.", slots: ["belt", "bracers", "chest", "feet", "hands", "head", "legs", "underwear"] },
  { id: 14766, name: "Ослепительная руна лазурного полумесяца", grade: 4, iconUrl: RUNE_ICON("ослепительная_руна_лазурного_полумесяца_14766"), effect: "Интеллект: +9 ед.", slots: ["belt", "bracers", "chest", "feet", "hands", "head", "legs", "underwear"] },
  { id: 14775, name: "Ослепительная руна лилового полумесяца", grade: 4, iconUrl: RUNE_ICON("ослепительная_руна_лилового_полумесяца_14775"), effect: "Сила духа: +9 ед.", slots: ["belt", "bracers", "chest", "feet", "hands", "head", "legs", "underwear"] },
  { id: 14726, name: "Ослепительная руна янтарного полумесяца", grade: 4, iconUrl: RUNE_ICON("ослепительная_руна_янтарного_полумесяца_14726"), effect: "Ловкость: +9 ед.", slots: ["belt", "bracers", "chest", "feet", "hands", "head", "legs", "underwear"] },
  { id: 39947, name: "Сияющая звезда жалящих стрел", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_жалящих_стрел_39947"), effect: "Критический урон в дальнем бою: +12%", slots: ["hands"] },
  { id: 39959, name: "Сияющая звезда жреца", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_жреца_39959"), effect: "Доп. эффективность умений целителя: +2%", slots: ["one_handed", "shield"] },
  { id: 39950, name: "Сияющая звезда завоевателя", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_завоевателя_39950"), effect: "Дополнительный урон умений ближнего боя: +3%", slots: ["two_handed"] },
  { id: 39965, name: "Сияющая звезда капеллана", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_капеллана_39965"), effect: "Критический эффект исцеления: +8%", slots: ["hands"] },
  { id: 39945, name: "Сияющая звезда ледяного гнева", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_ледяного_гнева_39945"), effect: "Критический урон в ближнем бою: +12%", slots: ["hands"] },
  { id: 39944, name: "Сияющая звезда нерушимой защиты", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_нерушимой_защиты_39944"), effect: "Получаемый урон: -3%", slots: ["chest"] },
  { id: 39949, name: "Сияющая звезда пророка", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_пророка_39949"), effect: "Дополнительный урон умений заклинателя: +2%", slots: ["one_handed", "shield"] },
  { id: 39918, name: "Сияющая звезда славы", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_славы_39918"), effect: "Устойчивость к атакам в PvP: +335 ед.", slots: ["chest", "feet", "legs"] },
  { id: 39917, name: "Сияющая звезда стойкости", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_стойкости_39917"), effect: "Устойчивость к критическому урону: +320 ед.", slots: ["chest", "feet", "legs"] },
  { id: 39948, name: "Сияющая звезда стража", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_стража_39948"), effect: "Дополнительный урон умений ближнего боя: +2%", slots: ["one_handed", "shield"] },
  { id: 39952, name: "Сияющая звезда стрелка", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_стрелка_39952"), effect: "Дополнительный урон умений дальнего боя: +2%", slots: ["ranged"] },
  { id: 39962, name: "Сияющая звезда целителя", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_целителя_39962"), effect: "Доп. эффективность умений целителя: +3%", slots: ["two_handed"] },
  { id: 39951, name: "Сияющая звезда чародея", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_чародея_39951"), effect: "Дополнительный урон умений заклинателя: +3%", slots: ["two_handed"] },
  { id: 39916, name: "Сияющая звезда ярости", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_ярости_39916"), effect: "Тактическая подготовка: +375 ед.", slots: ["chest", "feet", "legs"] },
  { id: 39946, name: "Сияющая звезда яростного пламени", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_яростного_пламени_39946"), effect: "Критический урон заклинаний: +8%", slots: ["hands"] },
  { id: 39943, name: "Сияющая звезда ясного разума", grade: 4, iconUrl: RUNE_ICON("сияющая_звезда_ясного_разума_39943"), effect: "Задержка применения умений при получении удара: +30%", slots: ["head"] },
  { id: 55260, name: "Уникальная руна ифнирского бойца", grade: 4, iconUrl: RUNE_ICON("уникальная_руна_ифнирского_бойца_55260"), effect: "Сила атаки в ближнем бою: +5.5 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55275, name: "Уникальная руна ифнирского лекаря", grade: 4, iconUrl: RUNE_ICON("уникальная_руна_ифнирского_лекаря_55275"), effect: "Эффективность исцеления: +5.5 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55265, name: "Уникальная руна ифнирского лучника", grade: 4, iconUrl: RUNE_ICON("уникальная_руна_ифнирского_лучника_55265"), effect: "Сила атаки в дальнем бою: +5.5 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55270, name: "Уникальная руна ифнирского чародея", grade: 4, iconUrl: RUNE_ICON("уникальная_руна_ифнирского_чародея_55270"), effect: "Сила заклинаний: +5.5 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 24757, name: "Звезда милосердия", grade: 3, iconUrl: RUNE_ICON("звезда_милосердия_24757"), effect: "Восприимчивость к исцелению: +10%", slots: ["chest"] },
  { id: 24753, name: "Звезда следопыта", grade: 3, iconUrl: RUNE_ICON("звезда_следопыта_24753"), effect: "Дальность обнаружения скрытных существ: +20%", slots: ["head"] },
  { id: 8001341, name: "Королевский лунный изумруд берсерка", grade: 3, iconUrl: RUNE_ICON("королевский_лунный_изумруд_берсерка_8001341"), effect: "Сопротивление: +53 ед. / Сила атаки в ближнем бою: +3 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 8001340, name: "Королевский лунный изумруд волхва", grade: 3, iconUrl: RUNE_ICON("королевский_лунный_изумруд_волхва_8001340"), effect: "Защита: +53 ед. / Эффективность исцеления: +3 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 8001338, name: "Королевский лунный изумруд заклинателя", grade: 3, iconUrl: RUNE_ICON("королевский_лунный_изумруд_заклинателя_8001338"), effect: "Защита: +53 ед. / Сила заклинаний: +3 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 8001344, name: "Королевский лунный изумруд знахаря", grade: 3, iconUrl: RUNE_ICON("королевский_лунный_изумруд_знахаря_8001344"), effect: "Эффективность исцеления: +3 ед. / Сопротивление: +53 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 8001342, name: "Королевский лунный изумруд карателя", grade: 3, iconUrl: RUNE_ICON("королевский_лунный_изумруд_карателя_8001342"), effect: "Сопротивление: +53 ед. / Сила атаки в дальнем бою: +3 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 8001337, name: "Королевский лунный изумруд кирасира", grade: 3, iconUrl: RUNE_ICON("королевский_лунный_изумруд_кирасира_8001337"), effect: "Защита: +53 ед. / Сила атаки в ближнем бою: +3 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 8001339, name: "Королевский лунный изумруд мстителя", grade: 3, iconUrl: RUNE_ICON("королевский_лунный_изумруд_мстителя_8001339"), effect: "Защита: +53 ед. / Сила атаки в дальнем бою: +3 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 8001343, name: "Королевский лунный изумруд оракула", grade: 3, iconUrl: RUNE_ICON("королевский_лунный_изумруд_оракула_8001343"), effect: "Сопротивление: +53 ед. / Сила заклинаний: +3 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 24745, name: "Ограненный лунный камень бастиона", grade: 3, iconUrl: RUNE_ICON("ограненный_лунный_камень_бастиона_24745"), effect: "Защита: +270 ед.", slots: ["shield"] },
  { id: 45571, name: "Ограненный лунный камень легкой поступи", grade: 3, iconUrl: RUNE_ICON("ограненный_лунный_камень_легкой_поступи_45571"), effect: "Скорость передвижения: +5%", slots: ["feet"] },
  { id: 24717, name: "Ограненный лунный камень пяти морей", grade: 3, iconUrl: RUNE_ICON("ограненный_лунный_камень_пяти_морей_24717"), effect: "Скорость плавания: +12%", slots: ["feet"] },
  { id: 45576, name: "Ограненный лунный камень смертоносного меча", grade: 3, iconUrl: RUNE_ICON("ограненный_лунный_камень_смертоносного_меча_45576"), effect: "Шанс критического удара в ближнем бою: +2%", slots: ["hands"] },
  { id: 45569, name: "Ограненный лунный камень смертоносного огня", grade: 3, iconUrl: RUNE_ICON("ограненный_лунный_камень_смертоносного_огня_45569"), effect: "Шанс критического удара заклинанием: +2%", slots: ["hands"] },
  { id: 45582, name: "Ограненный лунный камень смертоносных стрел", grade: 3, iconUrl: RUNE_ICON("ограненный_лунный_камень_смертоносных_стрел_45582"), effect: "Шанс критического удара в дальнем бою: +2%", slots: ["hands"] },
  { id: 45577, name: "Ограненный лунный камень чтеца", grade: 3, iconUrl: RUNE_ICON("ограненный_лунный_камень_чтеца_45577"), effect: "Время применения умений: -2%", slots: ["head"] },
  { id: 55259, name: "Редкая руна ифнирского бойца", grade: 3, iconUrl: RUNE_ICON("редкая_руна_ифнирского_бойца_55259"), effect: "Сила атаки в ближнем бою: +3.8 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55274, name: "Редкая руна ифнирского лекаря", grade: 3, iconUrl: RUNE_ICON("редкая_руна_ифнирского_лекаря_55274"), effect: "Эффективность исцеления: +3.8 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55264, name: "Редкая руна ифнирского лучника", grade: 3, iconUrl: RUNE_ICON("редкая_руна_ифнирского_лучника_55264"), effect: "Сила атаки в дальнем бою: +3.8 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55269, name: "Редкая руна ифнирского чародея", grade: 3, iconUrl: RUNE_ICON("редкая_руна_ифнирского_чародея_55269"), effect: "Сила заклинаний: +3.8 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55258, name: "Необычная руна ифнирского бойца", grade: 2, iconUrl: RUNE_ICON("необычная_руна_ифнирского_бойца_55258"), effect: "Сила атаки в ближнем бою: +3.3 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55273, name: "Необычная руна ифнирского лекаря", grade: 2, iconUrl: RUNE_ICON("необычная_руна_ифнирского_лекаря_55273"), effect: "Эффективность исцеления: +3.3 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55263, name: "Необычная руна ифнирского лучника", grade: 2, iconUrl: RUNE_ICON("необычная_руна_ифнирского_лучника_55263"), effect: "Сила атаки в дальнем бою: +3.3 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 55268, name: "Необычная руна ифнирского чародея", grade: 2, iconUrl: RUNE_ICON("необычная_руна_ифнирского_чародея_55268"), effect: "Сила заклинаний: +3.3 ед.", slots: ["earring1", "earring2", "instrument", "necklace", "ring1", "ring2"] },
  { id: 24719, name: "Обработанный лунный камень грации", grade: 2, iconUrl: RUNE_ICON("обработанный_лунный_камень_грации_24719"), effect: "Урон при падении: -20%", slots: ["feet"] },
  { id: 43154, name: "Эфенская руна карающего огня", grade: 6, iconUrl: RUNE_ICON("эфенская_руна_карающего_огня_43154"), effect: "Сила атаки в ближнем бою: +10 ед. / Устойчивость к критическому урону: +150 ед.", slots: EPHEN_RUNE_SLOTS, restrictedToItemIds: EPHEN_ITEM_IDS },
  { id: 43155, name: "Эфенская руна изначальных ветров", grade: 6, iconUrl: RUNE_ICON("эфенская_руна_изначальных_ветров_43155"), effect: "Сила атаки в дальнем бою: +10 ед. / Устойчивость к критическому урону: +150 ед.", slots: EPHEN_RUNE_SLOTS, restrictedToItemIds: EPHEN_ITEM_IDS },
  { id: 43156, name: "Эфенская руна земной тверди", grade: 6, iconUrl: RUNE_ICON("эфенская_руна_земной_тверди_43156"), effect: "Защита: +160 ед. / Устойчивость к критическому урону: +150 ед.", slots: EPHEN_RUNE_SLOTS, restrictedToItemIds: EPHEN_ITEM_IDS },
  { id: 43157, name: "Эфенская руна ледяных штормов", grade: 6, iconUrl: RUNE_ICON("эфенская_руна_ледяных_штормов_43157"), effect: "Сила заклинаний: +10 ед. / Устойчивость к критическому урону: +150 ед.", slots: EPHEN_RUNE_SLOTS, restrictedToItemIds: EPHEN_ITEM_IDS },
  { id: 43158, name: "Эфенская руна вечной жизни", grade: 6, iconUrl: RUNE_ICON("эфенская_руна_вечной_жизни_43158"), effect: "Эффективность исцеления: +10 ед. / Устойчивость к критическому урону: +150 ед.", slots: EPHEN_RUNE_SLOTS, restrictedToItemIds: EPHEN_ITEM_IDS },
  { id: 44000, name: "Эфенская руна искрящихся молний", grade: 6, iconUrl: RUNE_ICON("эфенская_руна_искрящихся_молний_44000"), effect: "Сноровка: +10 ед. / Устойчивость к критическому урону: +150 ед.", slots: EPHEN_RUNE_SLOTS, restrictedToItemIds: EPHEN_ITEM_IDS },
  { id: 44001, name: "Эфенская руна грозовых вихрей", grade: 6, iconUrl: RUNE_ICON("эфенская_руна_грозовых_вихрей_44001"), effect: "Пробивание брони: +140 ед. / Устойчивость к критическому урону: +150 ед.", slots: EPHEN_RUNE_SLOTS, restrictedToItemIds: EPHEN_ITEM_IDS },
  { id: 44002, name: "Эфенская руна неукротимого смерча", grade: 6, iconUrl: RUNE_ICON("эфенская_руна_неукротимого_смерча_44002"), effect: "Время применения умений: -0.8% / Устойчивость к критическому урону: +150 ед.", slots: EPHEN_RUNE_SLOTS, restrictedToItemIds: EPHEN_ITEM_IDS },
];

const RUNE_BY_ID = new Map(RUNES.map((r) => [r.id, r]));

function getApplicableTags(
  slotKey: string,
  handedness?: WeaponHandedness,
): string[] {
  switch (slotKey) {
    case "weapon_main":
      if (handedness === "two-handed") return ["two_handed"];
      if (handedness === "one-handed") return ["one_handed"];
      return ["one_handed", "two_handed"];
    case "weapon_off":
      if (handedness === "shield") return ["shield"];
      if (handedness === "one-handed") return ["one_handed"];
      return ["one_handed", "shield"];
    case "weapon_ranged":
      return ["ranged"];
    default:
      return [slotKey];
  }
}

function matchesItemRestriction(rune: Rune, itemId?: number): boolean {
  if (!rune.restrictedToItemIds) return true;
  return itemId !== undefined && rune.restrictedToItemIds.includes(itemId);
}

export function isValidRuneId(
  id: number,
  slotKey: string,
  handedness?: WeaponHandedness,
  itemId?: number,
): boolean {
  const rune = RUNE_BY_ID.get(id);
  if (!rune) return false;
  const tags = getApplicableTags(slotKey, handedness);
  return (
    tags.some((tag) => rune.slots.includes(tag)) &&
    matchesItemRestriction(rune, itemId)
  );
}

export function findRune(id: number): Rune | undefined {
  return RUNE_BY_ID.get(id);
}

export function getRunesForSlot(
  slotKey: string,
  handedness?: WeaponHandedness,
  itemId?: number,
): Rune[] {
  const tags = getApplicableTags(slotKey, handedness);
  return RUNES.filter(
    (r) =>
      tags.some((tag) => r.slots.includes(tag)) &&
      matchesItemRestriction(r, itemId),
  );
}
