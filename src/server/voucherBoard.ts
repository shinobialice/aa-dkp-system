import "server-only";
import type { GameServer } from "@/shared/config/gameServers";
import {
  gisaaVoucherUrl,
  VOUCHER_RESET_TIME,
  VOUCHER_ZONES,
  type VoucherResource,
  type VoucherSide,
} from "@/shared/config/voucherBoard";
import sql from "@/shared/lib/db";
import type { UserRow, VoucherReportRow } from "@/shared/lib/dbTypes";
import { moscowTodayKey } from "@/widgets/Attendance/attendanceModel";

export type VoucherZone = {
  zone: string;
  amount: number | null;
  source: "gisaa" | "site" | null;
  reportedBy: string | null;
};
export type VoucherBoard = Record<
  VoucherResource,
  Record<VoucherSide, VoucherZone[]>
>;

type SiteReport = Pick<VoucherReportRow, "zone" | "amount"> &
  Pick<UserRow, "username">;

const REVALIDATE_SECONDS = 600;
const MINUTE_MS = 60 * 1000;
const DAY_MINUTES = 24 * 60;

export function voucherPeriod(now = Date.now()) {
  const [hours, minutes] = VOUCHER_RESET_TIME.split(":").map(Number);
  const untilMidnight = DAY_MINUTES - (hours * 60 + minutes);
  return moscowTodayKey(now + untilMidnight * MINUTE_MS);
}

export async function loadVoucherBoard(
  server: GameServer,
): Promise<VoucherBoard> {
  const [gisaa, reports] = await Promise.all([
    fetchGisaaAmounts(server),
    sql<SiteReport[]>`
      SELECT r.zone, r.amount, u.username
      FROM voucher_report r
      JOIN "user" u ON u.id = r.user_id
      WHERE r.server = ${server} AND r.period = ${voucherPeriod()}
    `,
  ]);
  const siteReports = new Map(reports.map((report) => [report.zone, report]));

  const toZone = (zone: string): VoucherZone => {
    const fromGisaa = gisaa.get(zone);
    if (fromGisaa !== undefined) {
      return { zone, amount: fromGisaa, source: "gisaa", reportedBy: null };
    }
    const report = siteReports.get(zone);
    if (!report) return { zone, amount: null, source: null, reportedBy: null };
    return {
      zone,
      amount: report.amount,
      source: "site",
      reportedBy: report.username,
    };
  };
  const sidesOf = (resource: VoucherResource) => ({
    west: VOUCHER_ZONES[resource].west.map(toZone),
    east: VOUCHER_ZONES[resource].east.map(toZone),
  });

  return {
    fabric: sidesOf("fabric"),
    leather: sidesOf("leather"),
    wood: sidesOf("wood"),
    iron: sidesOf("iron"),
  };
}

async function fetchGisaaAmounts(server: GameServer) {
  try {
    const response = await fetch(gisaaVoucherUrl(server), {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      throw new Error(`gisaa.ru ответил статусом ${response.status}`);
    }
    return parseGisaaAmounts(await response.text());
  } catch (error) {
    console.error("Не удалось получить векселя с gisaa.ru:", error);
    return new Map<string, number>();
  }
}

function parseGisaaAmounts(html: string) {
  const amounts = new Map<string, number>();
  const table = html.match(
    /<table[^>]*id="screenshot_style"[^>]*>([\s\S]*?)<\/table>/,
  );
  if (!table) return amounts;

  for (const row of table[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(
      (cell) => cell[1].replace(/<[^>]+>/g, "").trim(),
    );
    if (cells.length !== 5) continue;
    const [westAmount, westZone, , eastZone, eastAmount] = cells;
    addAmount(amounts, westZone, westAmount);
    addAmount(amounts, eastZone, eastAmount);
  }
  return amounts;
}

function addAmount(amounts: Map<string, number>, zone: string, value: string) {
  if (zone && /^\d+$/.test(value)) amounts.set(zone, Number(value));
}
