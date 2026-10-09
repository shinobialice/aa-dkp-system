export type KillcountRank = {
  name: string;
  minKills: number;
  icon: string;
};

const MEDAL_NAMES = [
  "Рекрут",
  "Страж",
  "Рыцарь",
  "Герой",
  "Легенда",
  "Властелин",
  "Божество",
];

const RANK_THRESHOLDS = [
  [1, 20, 40, 60, 80],
  [100, 130, 160, 190, 220],
  [250, 290, 330, 370, 410],
  [450, 500, 550, 600, 650],
  [700, 760, 820, 880, 940],
  [1000, 1100, 1200, 1300, 1400],
  [1500, 1750, 2000, 2250, 2500],
];

const UNRANKED_RANK: KillcountRank = {
  name: "Без ранга",
  minKills: 0,
  icon: "/images/ranks/140px-SeasonalRank0-0.png",
};

export const KILLCOUNT_RANKS: KillcountRank[] = [
  UNRANKED_RANK,
  ...RANK_THRESHOLDS.flatMap((stars, medalIndex) =>
    stars.map((minKills, starIndex) => ({
      name: `${MEDAL_NAMES[medalIndex]} ${starIndex + 1}`,
      minKills,
      icon: `/images/ranks/140px-SeasonalRank${medalIndex + 1}-${starIndex + 1}.png`,
    })),
  ),
];

export const TOP_RANK: KillcountRank = {
  name: "Топ",
  minKills: 2750,
  icon: "/images/ranks/140px-SeasonalRankTop.png",
};

export function getKillcountRank(
  kills: number,
  place: number,
): {
  current: KillcountRank;
  next: KillcountRank | null;
  leaderboardPlace: number | null;
} {
  if (kills >= TOP_RANK.minKills) {
    return {
      current: { ...TOP_RANK, name: `Топ ${place}` },
      next: null,
      leaderboardPlace: place,
    };
  }

  const index = Math.max(
    KILLCOUNT_RANKS.filter((rank) => kills >= rank.minKills).length - 1,
    0,
  );

  return {
    current: KILLCOUNT_RANKS[index],
    next: KILLCOUNT_RANKS[index + 1] ?? TOP_RANK,
    leaderboardPlace: null,
  };
}
