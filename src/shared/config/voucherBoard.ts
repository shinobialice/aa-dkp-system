import type { GameServer } from "./gameServers";

export const VOUCHER_RESOURCES = ["fabric", "leather", "wood", "iron"] as const;

export type VoucherResource = (typeof VOUCHER_RESOURCES)[number];

export type VoucherSide = "west" | "east";

export const VOUCHER_RESOURCE_NAMES: Record<VoucherResource, string> = {
  fabric: "Ткань",
  leather: "Кожа",
  wood: "Дерево",
  iron: "Железо",
};

export const VOUCHER_SIDE_NAMES: Record<VoucherSide, string> = {
  west: "Запад",
  east: "Восток",
};

export const VOUCHER_ZONES: Record<
  VoucherResource,
  Record<VoucherSide, string[]>
> = {
  fabric: {
    west: ["Мэрианхольд", "Холмы Лилиот", "Две Короны", "Золотые равнины"],
    east: ["Радужные пески", "Плато Соколиной Охоты"],
  },
  leather: {
    west: [
      "Кладбище драконов",
      "Иммергрунское нагорье",
      "Долгая коса",
      "Долина цветущих прудов",
    ],
    east: ["Махадеби", "Поющая земля", "Саванна", "Рокочущие перевалы"],
  },
  wood: {
    west: [
      "Лес Гвинедар",
      "Полуостров Солрид",
      "Белый лес",
      "Заболоченные низины",
    ],
    east: ["Руины Харихараллы", "Инистра", "Хазира", "Древний лес"],
  },
  iron: {
    west: [
      "Земля говорящих камней",
      "Морозная гряда",
      "Полуостров падающих звезд",
    ],
    east: [
      "Полуостров Рассвета",
      "Багровый каньон",
      "Тигриный хребет",
      "Долина талых снегов",
    ],
  },
};

export const VOUCHER_AMOUNTS = [20, 60, 100] as const;

// Задания на досках общин меняются раз в сутки, по наблюдениям игроков
// в 23:55 МСК (точное время не подтверждено).
export const VOUCHER_RESET_TIME = "23:55";

const GISAA_SERVER_IDS: Record<GameServer, number> = {
  Ифнир: 49,
  Корвус: 42,
  Ксанатос: 61,
  Луций: 1,
  Мираж: 65,
  Мирр: 67,
  Нагашар: 64,
  Рейвен: 63,
  Тарон: 62,
  Фанем: 45,
  Фесаникс: 66,
  Шаеда: 46,
};

export function gisaaVoucherUrl(server: GameServer) {
  return `https://gisaa.ru/veksel/${GISAA_SERVER_IDS[server]}`;
}

export function isVoucherZone(zone: string) {
  return VOUCHER_RESOURCES.some((resource) =>
    Object.values(VOUCHER_ZONES[resource]).some((zones) =>
      zones.includes(zone),
    ),
  );
}

export function isVoucherAmount(amount: number) {
  return VOUCHER_AMOUNTS.some((option) => option === amount);
}
