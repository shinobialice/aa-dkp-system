export type AttendanceBonusMode = "add" | "multiply";

// Полный редактируемый ряд — как в Настройках, по значению для фришки и для
// пвп-режима гильдии (см. guildStatusSettings.ts), плюс список боссов, на
// которых бонус применяется (attendance_bonus_boss). Живёт в таблице
// attendance_bonus_types.
export type AttendanceBonusTypeRow = {
  id: number;
  label: string;
  modeFreeshard: AttendanceBonusMode;
  modePvp: AttendanceBonusMode;
  valueFreeshard: number;
  valuePvp: number;
  bossIds: number[];
  sortOrder: number;
};

// Резолвнутый под текущий режим гильдии (фришка/пвп) бонус — то, что нужно при
// создании/редактировании рейда для расчёта dkp.
export type ResolvedAttendanceBonus = {
  id: number;
  label: string;
  mode: AttendanceBonusMode;
  value: number;
  bossIds: number[];
};
