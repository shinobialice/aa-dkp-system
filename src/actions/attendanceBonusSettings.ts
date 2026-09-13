"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";
import { getGuildStatus } from "./guildStatusSettings";
import type {
  AttendanceBonusMode,
  AttendanceBonusTypeRow,
  ResolvedAttendanceBonus,
} from "@/utils/attendanceBonusDefaults";

async function getBossIdsByBonus(): Promise<Map<number, number[]>> {
  const rows = await sql<any[]>`SELECT bonus_type_id, boss_id FROM attendance_bonus_boss`;
  const map = new Map<number, number[]>();
  for (const r of rows) {
    const list = map.get(r.bonus_type_id) ?? [];
    list.push(r.boss_id);
    map.set(r.bonus_type_id, list);
  }
  return map;
}

// Используется в Настройках — полный редактируемый набор бонусов.
export async function getAttendanceBonusTypesForSettings(): Promise<
  AttendanceBonusTypeRow[]
> {
  let rows, bossIdsByBonus;
  try {
    [rows, bossIdsByBonus] = await Promise.all([
      sql<any[]>`SELECT * FROM attendance_bonus_types ORDER BY sort_order, id`,
      getBossIdsByBonus(),
    ]);
  } catch (error) {
    console.error("Ошибка при получении бонусов за посещение:", error);
    throw new Error("Не удалось загрузить бонусы за посещение");
  }

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    modeFreeshard: r.mode_freeshard,
    modePvp: r.mode_pvp,
    valueFreeshard: Number(r.value_freeshard),
    valuePvp: Number(r.value_pvp),
    bossIds: bossIdsByBonus.get(r.id) ?? [],
    sortOrder: r.sort_order,
  }));
}

// Используется при создании/редактировании рейда — резолвит сразу под текущий
// режим гильдии (фришка/пвп), как getBosses() делает для dkp_points.
export async function getAttendanceBonusTypesForRaid(): Promise<
  ResolvedAttendanceBonus[]
> {
  let rows, status, bossIdsByBonus;
  try {
    [rows, status, bossIdsByBonus] = await Promise.all([
      sql<any[]>`SELECT * FROM attendance_bonus_types ORDER BY sort_order, id`,
      getGuildStatus(),
      getBossIdsByBonus(),
    ]);
  } catch (error) {
    console.error("Ошибка при получении бонусов за посещение:", error);
    throw new Error("Не удалось загрузить бонусы за посещение");
  }

  const isPvp = status.mode === "pvp";

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    mode: isPvp ? r.mode_pvp : r.mode_freeshard,
    value: Number(isPvp ? r.value_pvp : r.value_freeshard),
    bossIds: bossIdsByBonus.get(r.id) ?? [],
  }));
}

export async function createAttendanceBonusType(): Promise<AttendanceBonusTypeRow> {
  await ensurePrivilieges(["Администратор"]);

  let row;
  try {
    const [{ next_order }] = await sql<any[]>`
      SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order
      FROM attendance_bonus_types
    `;
    [row] = await sql<any[]>`
      INSERT INTO attendance_bonus_types (label, sort_order)
      VALUES ('Новый бонус', ${next_order})
      RETURNING *
    `;
  } catch (error) {
    console.error("Ошибка при создании бонуса за посещение:", error);
    throw new Error("Не удалось создать бонус");
  }

  revalidatePath("/settings");
  return {
    id: row.id,
    label: row.label,
    modeFreeshard: row.mode_freeshard,
    modePvp: row.mode_pvp,
    valueFreeshard: Number(row.value_freeshard),
    valuePvp: Number(row.value_pvp),
    bossIds: [],
    sortOrder: row.sort_order,
  };
}

export async function updateAttendanceBonusTypes(
  rows: {
    id: number;
    label: string;
    modeFreeshard: AttendanceBonusMode;
    modePvp: AttendanceBonusMode;
    valueFreeshard: number;
    valuePvp: number;
    bossIds: number[];
  }[],
) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await Promise.all(
      rows.map(async (r) => {
        await sql<any[]>`
          UPDATE attendance_bonus_types SET
            label = ${r.label},
            mode_freeshard = ${r.modeFreeshard},
            mode_pvp = ${r.modePvp},
            value_freeshard = ${r.valueFreeshard},
            value_pvp = ${r.valuePvp}
          WHERE id = ${r.id}
        `;
        await sql<any[]>`DELETE FROM attendance_bonus_boss WHERE bonus_type_id = ${r.id}`;
        if (r.bossIds.length > 0) {
          await sql<any[]>`
            INSERT INTO attendance_bonus_boss ${sql(
              r.bossIds.map((boss_id) => ({ bonus_type_id: r.id, boss_id })),
            )}
          `;
        }
      }),
    );
  } catch (error) {
    console.error("Ошибка при сохранении бонусов за посещение:", error);
    throw new Error("Не удалось сохранить бонусы за посещение");
  }

  revalidatePath("/settings");
}

export async function deleteAttendanceBonusType(id: number) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql<any[]>`DELETE FROM attendance_bonus_types WHERE id = ${id}`;
  } catch (error) {
    console.error("Ошибка при удалении бонуса за посещение:", error);
    throw new Error("Не удалось удалить бонус");
  }

  revalidatePath("/settings");
}
