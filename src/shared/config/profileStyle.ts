import { plural } from "@/shared/lib/format";
import { KILLCOUNT_RANKS, TOP_RANK } from "./killcountRanks";

export const PROFILE_EFFECTS = [
  { value: "snow", label: "Снегопад" },
  { value: "sakura", label: "Сакура" },
  { value: "halloween", label: "Хеллоуин" },
  { value: "hearts", label: "Сердечки" },
  { value: "sea", label: "Морская" },
  { value: "leaves", label: "Листопад" },
  { value: "fire", label: "Огонь" },
  { value: "rainbow", label: "Радуга" },
  { value: "crystal_moon", label: "Кристаллическая луна" },
  { value: "fireflies", label: "Светлячки" },
  { value: "dragon", label: "Дракон" },
] as const;

export type ProfileEffect = (typeof PROFILE_EFFECTS)[number]["value"];

export const FRAME_UNLOCK_TYPES = [
  { value: "free", label: "Доступна всем" },
  { value: "class", label: "Класс игрока" },
  { value: "rank", label: "Ранг в текущем варе" },
  { value: "tenure", label: "Стаж в гильдии" },
] as const;

export type FrameUnlockType = (typeof FRAME_UNLOCK_TYPES)[number]["value"];

export const FRAME_RANK_OPTIONS = [...KILLCOUNT_RANKS.slice(1), TOP_RANK].map(
  (rank) => ({ minKills: rank.minKills, name: rank.name }),
);

export function isProfileEffect(value: string): value is ProfileEffect {
  return PROFILE_EFFECTS.some((effect) => effect.value === value);
}

export function isFrameUnlockType(value: string): value is FrameUnlockType {
  return FRAME_UNLOCK_TYPES.some((type) => type.value === value);
}

export function describeFrameUnlock(
  type: string,
  value: number,
  unlockClass: string | null,
) {
  if (type === "class") return `Класс «${unlockClass}» в профиле`;
  if (type === "rank") {
    const rank = FRAME_RANK_OPTIONS.find((option) => option.minKills === value);
    return `Ранг «${rank?.name ?? `${value} киллов`}» в текущем варе`;
  }
  if (type === "tenure") {
    return `${value} ${plural(value, "год", "года", "лет")} в гильдии`;
  }
  return "Доступна всем";
}
