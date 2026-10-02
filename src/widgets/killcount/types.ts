// @todo: rewrite
type Id = number | string;

export interface KillCounterDto {
  playerClass: string;
  userName: string;
  userId: string;
  startHonor: number;
  endHonor: number;
  startKills: number;
  endKills: number;
  comment?: string;
  totalKills: number;
  totalHonor: number;
  id: Id;
}

export interface KillCount {
  playerClass: string;
  userName: string;
  userId?: Id;
  role?: string | null;
  avatarUrl?: string | null;
  startHonor: number;
  endHonor: number;
  startKills: number;
  endKills: number;
  comment?: string;
  id: Id;
}

export interface DB_GetKillCountDto {
  userName: string;
  role?: string | null;
  avatarUrl?: string | null;
  id: Id;
  userId?: string;
  eventId: number;
  startHonor: number;
  endHonor: number;
  startKills: number;
  endKills: number;
  playerClass: string;
  comment?: string;
  totalKills: number;
  totalHonor: number;
}

export interface DB_UpdateKillCountDto {
  id: Id;
  startHonor: number;
  endHonor: number;
  startKills: number;
  endKills: number;
  playerClass: string;
  comment?: string;
}

export interface KillCountHistoryData {
  date: string;
  /** SUM(...) в Postgres — bigint, приходит строкой. */
  totalKills: string;
  playersCount: number;
  warId: string | null;
  topUserId: number | null;
  topUserName: string | null;
  topKills: number | null;
  topAvatarUrl: string | null;
}

export interface KillCountWar {
  id: string;
  opponentGuild: string | null;
  startedAt: string;
  endedAt: string | null;
}
