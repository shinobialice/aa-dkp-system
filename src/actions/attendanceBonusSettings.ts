"use server";

import sql from "@/shared/lib/db";
import type {
  AttendanceBonusBossRow,
  AttendanceBonusTypesRow,
} from "@/shared/lib/dbTypes";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";
import { getGuildStatus, getGuildModeAtDate } from "./guildStatusSettings";
import type {
  AttendanceBonusMode,
  AttendanceBonusTypeRow,
  ResolvedAttendanceBonus,
} from "@/utils/attendanceBonusDefaults";

function toBonusMode(value: string): AttendanceBonusMode {
  return value === "multiply" ? "multiply" : "add";
}

function toBonusType(
  row: AttendanceBonusTypesRow,
  bossIds: number[],
): AttendanceBonusTypeRow {
  return {
    id: row.id,
    label: row.label,
    modeFreeshard: toBonusMode(row.mode_freeshard),
    modePvp: toBonusMode(row.mode_pvp),
    valueFreeshard: row.value_freeshard,
    valuePvp: row.value_pvp,
    bossIds,
    sortOrder: row.sort_order,
  };
}

function getBonusTypes() {
  return sql<AttendanceBonusTypesRow[]>`
    SELECT * FROM attendance_bonus_types ORDER BY sort_order, id
  `;
}

async function getBossIdsByBonus(): Promise<Map<number, number[]>> {
  const rows = await sql<AttendanceBonusBossRow[]>`
    SELECT bonus_type_id, boss_id FROM attendance_bonus_boss
  `;
  const map = new Map<number, number[]>();
  for (const row of rows) {
    const list = map.get(row.bonus_type_id) ?? [];
    list.push(row.boss_id);
    map.set(row.bonus_type_id, list);
  }
  return map;
}

export async function getAttendanceBonusTypesForSettings(): Promise<
  AttendanceBonusTypeRow[]
> {
  try {
    const [rows, bossIdsByBonus] = await Promise.all([
      getBonusTypes(),
      getBossIdsByBonus(),
    ]);
    return rows.map((row) =>
      toBonusType(row, bossIdsByBonus.get(row.id) ?? []),
    );
  } catch (error) {
    console.error("Ошибка при получении бонусов за посещение:", error);
    throw new Error("Не удалось загрузить бонусы за посещение");
  }
}

// Если передана дата рейда, ставки берутся по режиму гильдии на эту дату,
// иначе рейд, отредактированный задним числом после смены режима, посчитался
// бы по ставкам чужого периода.
export async function getAttendanceBonusTypesForRaid(
  atDate?: Date | string,
): Promise<ResolvedAttendanceBonus[]> {
  try {
    const [rows, mode, bossIdsByBonus] = await Promise.all([
      getBonusTypes(),
      atDate
        ? getGuildModeAtDate(atDate)
        : getGuildStatus().then((status) => status.mode),
      getBossIdsByBonus(),
    ]);
    const isPvp = mode === "pvp";

    return rows.map((row) => ({
      id: row.id,
      label: row.label,
      mode: toBonusMode(isPvp ? row.mode_pvp : row.mode_freeshard),
      value: isPvp ? row.value_pvp : row.value_freeshard,
      bossIds: bossIdsByBonus.get(row.id) ?? [],
    }));
  } catch (error) {
    console.error("Ошибка при получении бонусов за посещение:", error);
    throw new Error("Не удалось загрузить бонусы за посещение");
  }
}

export async function createAttendanceBonusType(): Promise<AttendanceBonusTypeRow> {
  await ensurePrivilieges(["Администратор"]);

  let row: AttendanceBonusTypesRow | undefined;
  try {
    [row] = await sql<AttendanceBonusTypesRow[]>`
      INSERT INTO attendance_bonus_types (label, sort_order)
      SELECT 'Новый бонус', COALESCE(MAX(sort_order), 0) + 1
      FROM attendance_bonus_types
      RETURNING *
    `;
  } catch (error) {
    console.error("Ошибка при создании бонуса за посещение:", error);
    throw new Error("Не удалось создать бонус");
  }

  if (!row) throw new Error("Не удалось создать бонус");

  revalidatePath("/settings");
  return toBonusType(row, []);
}

export async function updateAttendanceBonusTypes(
  rows: Omit<AttendanceBonusTypeRow, "sortOrder">[],
) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql.begin(async (tx) => {
      for (const row of rows) {
        await tx`
          UPDATE attendance_bonus_types SET
            label = ${row.label},
            mode_freeshard = ${row.modeFreeshard},
            mode_pvp = ${row.modePvp},
            value_freeshard = ${row.valueFreeshard},
            value_pvp = ${row.valuePvp}
          WHERE id = ${row.id}
        `;
        await tx`DELETE FROM attendance_bonus_boss WHERE bonus_type_id = ${row.id}`;
        if (row.bossIds.length === 0) continue;
        await tx`
          INSERT INTO attendance_bonus_boss ${tx(
            row.bossIds.map((boss_id) => ({ bonus_type_id: row.id, boss_id })),
          )}
        `;
      }
    });
  } catch (error) {
    console.error("Ошибка при сохранении бонусов за посещение:", error);
    throw new Error("Не удалось сохранить бонусы за посещение");
  }

  revalidatePath("/settings");
}

export async function deleteAttendanceBonusType(id: number) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql`DELETE FROM attendance_bonus_types WHERE id = ${id}`;
  } catch (error) {
    console.error("Ошибка при удалении бонуса за посещение:", error);
    throw new Error("Не удалось удалить бонус");
  }

  revalidatePath("/settings");
}
