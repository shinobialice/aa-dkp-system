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
  startHonor: number;
  endHonor: number;
  startKills: number;
  endKills: number;
  comment?: string;
  id: Id;
}

export interface DB_GetKillCountDto {
  userName: string;
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
