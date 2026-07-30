export type AttendanceBonusSettings = {
  pvpPoints: number;
  pvpLongPoints: number;
  procPoints: number;
  doubleProcPoints: number;
};

// Полный редактируемый набор — по значению на каждый бонус для фришки и
// для пвп-режима гильдии (см. guildStatusSettings.ts), как у dkp_points_
// freeshard/dkp_points_pvp в таблице boss.
export type AttendanceBonusSettingsRow = {
  pvpPointsFreeshard: number;
  pvpPointsPvp: number;
  pvpLongPointsFreeshard: number;
  pvpLongPointsPvp: number;
  procPointsFreeshard: number;
  procPointsPvp: number;
  doubleProcPointsFreeshard: number;
  doubleProcPointsPvp: number;
};

// Совпадает с DEFAULT'ами в migration_attendance_bonus_settings.sql.
// Живёт отдельно от actions/attendanceBonusSettings.ts, потому что тот
// файл — "use server", а такие файлы могут экспортировать только async
// функции: экспорт этой константы оттуда ломает весь модуль в рантайме
// ("A "use server" file can only export async functions, found object").
export const DEFAULT_ATTENDANCE_BONUS_SETTINGS: AttendanceBonusSettings = {
  pvpPoints: 1,
  pvpLongPoints: 3,
  procPoints: 1,
  doubleProcPoints: 1,
};

export const DEFAULT_ATTENDANCE_BONUS_SETTINGS_ROW: AttendanceBonusSettingsRow =
  {
    pvpPointsFreeshard: 1,
    pvpPointsPvp: 1,
    pvpLongPointsFreeshard: 3,
    pvpLongPointsPvp: 3,
    procPointsFreeshard: 1,
    procPointsPvp: 1,
    doubleProcPointsFreeshard: 1,
    doubleProcPointsPvp: 1,
  };
