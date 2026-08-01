export type BossName = "Марли" | "Морф" | "Кириос";

export const bosses: BossName[] = ["Марли", "Морф", "Кириос"];

export const respawnWindow = 1; // hours, общий "промежуток" для всех боссов

export const respawnHoursByBoss: Record<BossName, number> = {
  Марли: 12,
  Морф: 12,
  Кириос: 2,
};

export function getRespawnStart(lastKill: string, respawnHours: number): Date {
  return new Date(new Date(lastKill).getTime() + respawnHours * 60 * 60 * 1000);
}
