"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui";
import {
  getGuildFunds,
  getSalariesForMonth,
  updateSalaryAdvance,
} from "@/actions/financeActions";
import { recalculateFinanceForMonthAsAdmin } from "@/actions/recalculateFinanceForMonth";
import { getUnpaidSalaryReasons } from "@/actions/getUnpaidSalaryReasons";
import FinanceSummary, { MySalaryCard } from "./FinanceSummary";
import SalaryTable from "./SalaryTable";
import { MONTHS, shiftMonth, type Fund, type SalaryRow } from "./financeModel";

const AUTO_REFRESH_MS = 30 * 1000;

type Loaded = {
  key: string;
  fund: Fund | null;
  salaries: SalaryRow[];
  updatedAt: Date;
};

export default function FinanceClient({
  currentMonth,
  currentYear,
  currentUserId,
  isAdmin,
}: {
  currentMonth: number;
  currentYear: number;
  currentUserId: number | null;
  isAdmin: boolean;
}) {
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [reasons, setReasons] = useState<{
    key: string;
    map: Record<number, string>;
  } | null>(null);
  const editingSalaryId = useRef<number | null>(null);

  const requestKey = `${year}-${month}`;
  const isCurrentLoaded = loaded?.key === requestKey;
  const fund = isCurrentLoaded ? loaded.fund : null;
  const salaries = useMemo(
    () => (isCurrentLoaded ? loaded.salaries : []),
    [isCurrentLoaded, loaded],
  );

  const refresh = useCallback(async (m: number, y: number) => {
    const [fundResult, salariesResult] = await Promise.all([
      getGuildFunds(m, y),
      getSalariesForMonth(m, y),
    ]);
    setLoaded((previous) => ({
      key: `${y}-${m}`,
      fund: fundResult,
      salaries:
        editingSalaryId.current !== null && previous?.key === `${y}-${m}`
          ? previous.salaries
          : (salariesResult as SalaryRow[]),
      updatedAt: new Date(),
    }));
  }, []);

  useEffect(() => {
    refresh(month, year);
    const tick = () => {
      if (document.visibilityState === "visible") refresh(month, year);
    };
    const interval = setInterval(tick, AUTO_REFRESH_MS);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("focus", tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("focus", tick);
    };
  }, [month, year, refresh]);

  const unpaidIds = useMemo(
    () => salaries.filter((row) => row.total <= 0).map((row) => row.userId),
    [salaries],
  );
  const unpaidKey = `${requestKey}:${unpaidIds.join(",")}`;

  useEffect(() => {
    if (unpaidIds.length === 0) return;
    let cancelled = false;
    getUnpaidSalaryReasons(month, year, unpaidIds).then((map) => {
      if (!cancelled) setReasons({ key: unpaidKey, map });
    });
    return () => {
      cancelled = true;
    };
  }, [month, year, unpaidIds, unpaidKey]);

  const recalculate = async () => {
    setRefreshing(true);
    try {
      await recalculateFinanceForMonthAsAdmin(month, year);
      await refresh(month, year);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAdvanceChange = async (
    salaryId: number,
    sentAmount: number,
    sent: boolean,
  ) => {
    setLoaded((previous) =>
      previous
        ? {
            ...previous,
            salaries: previous.salaries.map((row) =>
              row.id === salaryId ? { ...row, sentAmount, sent } : row,
            ),
          }
        : previous,
    );
    await updateSalaryAdvance(salaryId, sentAmount, sent);
  };

  const goToMonth = (delta: number) => {
    const next = shiftMonth(month, year, delta);
    setMonth(next.month);
    setYear(next.year);
  };

  const isLatestMonth = year * 12 + month >= currentYear * 12 + currentMonth;
  const myRow = salaries.find(
    (row) => row.userId === currentUserId && row.total > 0,
  );
  const myPlace = myRow
    ? [...salaries]
        .sort((a, b) => b.total - a.total)
        .findIndex((row) => row.id === myRow.id) + 1
    : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
            Финансы
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            Доход гильдии, казна и зарплаты
            {refreshing ? (
              <>
                · <Loader2 className="size-3.5 animate-spin" /> пересчёт…
              </>
            ) : (
              loaded &&
              ` · обновлено в ${loaded.updatedAt.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <div className="inline-flex h-10 items-center rounded-lg border bg-background">
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                aria-label="Предыдущий месяц"
                className="flex size-10 cursor-pointer items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="min-w-[128px] text-center text-sm font-semibold">
                {MONTHS[month - 1]} {year}
              </span>
              <button
                type="button"
                onClick={() => goToMonth(1)}
                disabled={isLatestMonth}
                aria-label="Следующий месяц"
                className="flex size-10 cursor-pointer items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          ) : (
            <span className="inline-flex h-10 items-center rounded-lg border px-3 text-sm font-semibold">
              {MONTHS[month - 1]} {year}
            </span>
          )}
          {isAdmin && (
            <Button
              variant="outline"
              onClick={recalculate}
              disabled={refreshing}
              className="h-10 cursor-pointer"
            >
              <RefreshCw className={refreshing ? "animate-spin" : undefined} />
              Пересчитать
            </Button>
          )}
        </div>
      </div>

      {!isCurrentLoaded ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Загрузка…
        </div>
      ) : (
        <>
          {myRow && <MySalaryCard row={myRow} place={myPlace} month={month} />}
          {fund ? (
            <FinanceSummary fund={fund} salaries={salaries} month={month} />
          ) : (
            <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              Фонд за этот месяц ещё не рассчитан
            </p>
          )}
          {salaries.length > 0 && (
            <SalaryTable
              rows={salaries}
              month={month}
              currentUserId={currentUserId}
              unpaidReasons={reasons?.key === unpaidKey ? reasons.map : {}}
              handlers={{
                isAdmin,
                onAdvanceChange: handleAdvanceChange,
                onEditStart: (id) => {
                  editingSalaryId.current = id;
                },
                onEditEnd: () => {
                  editingSalaryId.current = null;
                },
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
