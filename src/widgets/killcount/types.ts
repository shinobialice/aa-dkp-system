// @todo: rewrite
type Id = number | string;

export type KillCounterDto = {
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
};

export type KillCount = {
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
};

export type DB_GetKillCountDto = {
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
};

export type DB_UpdateKillCountDto = {
  id: Id;
  startHonor: number;
  endHonor: number;
  startKills: number;
  endKills: number;
  playerClass: string;
  comment?: string;
};

export type KillCountHistoryData = {
  date: string;
  totalKills: string;
  playersCount: number;
  warId: string | null;
  topUserId: number | null;
  topUserName: string | null;
  topKills: number | null;
  topAvatarUrl: string | null;
};

export type KillCountWar = {
  id: string;
  opponentGuild: string | null;
  startedAt: string;
  endedAt: string | null;
};
