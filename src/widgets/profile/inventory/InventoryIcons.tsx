// Раньше грузились напрямую с archeagecodex.com — залито локально в
// /api/uploads/misc-icons (archeagecodex.com блокирует хотлинк-запросы с
// другого домена, см. LootIconComponent.tsx про ту же причину переезда).
const inventoryIcons: { [key: string]: string } = {
  Фрегат: "/api/uploads/misc-icons/icon_item_2121.png",
  Кобуксон: "/api/uploads/misc-icons/icon_item_4147.png",
  Танк: "/api/uploads/misc-icons/icon_item_0341.png",
  Канонёрка: "/api/uploads/misc-icons/icon_item_5029.png",
  Бафалка: "/api/uploads/misc-icons/icon_item_2055.png",
  "Коллеционный глайдер": "/api/uploads/misc-icons/icon_item_4502.png",
  "Глайдер «Рассекатель небес»": "/api/uploads/misc-icons/icon_item_1369.png",
  "Крылья кровавого легиона": "/api/uploads/misc-icons/icon_item_3936.png",
  "Глайдер охотника на драконов": "/api/uploads/misc-icons/icon_item_1205.png",
  Авиара: "/api/uploads/misc-icons/icon_item_4312.png",
  "Коллеционный глайдер т2": "/api/uploads/misc-icons/icon_item_5871.png",
  "Коллекционный фамильяр": "/api/uploads/misc-icons/icon_item_4547.png",
  "Коллекционный фамильяр т2": "/api/uploads/misc-icons/icon_item_5854.png",
  "Коллекционный пет": "/api/uploads/misc-icons/icon_item_4450.png",
  "Коллекционный пет т2": "/api/uploads/misc-icons/icon_item_4450.png",
  Дракон: "/api/uploads/misc-icons/icon_item_4260.png",
  "Красный Дракон": "/api/uploads/misc-icons/icon_item_4308.png",
  "Черный Дракон": "/api/uploads/misc-icons/icon_item_4309.png",
  "Зеленый Дракон": "/api/uploads/misc-icons/icon_item_4310.png",
};
export default inventoryIcons;
