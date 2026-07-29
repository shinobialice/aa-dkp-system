"use client";

import React from "react";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ArrowUpDown, Loader2, RefreshCw } from "lucide-react";
import { Badge, Button } from "@/shared/ui";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { Input, Checkbox } from "@/shared/ui";
import {
  generateSalaries,
  getGuildFunds,
  getSalariesForMonth,
  updateSalaryAdvance,
} from "@/actions/financeActions";
import { generateGuildFunds } from "@/actions/generateGuildFunds";
import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";

const AUTO_REFRESH_MS = 60 * 1000;

type Fund = {
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  salaryBudget: number;
  treasuryBudget: number;
  inTreasury: number;
  advanceSent: number;
  carryOver: number;
};

type SalaryRow = {
  id: number;
  userId: number;
  username: string;
  class: string | null;
  amount: number;
  bonus: number | null;
  total: number;
  sentAmount: number;
  sent: boolean;
  tenurePercent: number;
  customBonusPercent: number;
  penaltyPercent: number;
  weightPercent: number;
  aglPercent: number;
  primePercent: number;
  totalPercent: number;
};

export default function FinanceClient({
  currentMonth,
  currentYear,
  isAdmin,
}: {
  currentMonth: number;
  currentYear: number;
  isAdmin: boolean;
}) {
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [fund, setFund] = useState<Fund | null>(null);
  const [salaries, setSalaries] = useState<SalaryRow[]>([]);

  const [sortKey, setSortKey] = useState<keyof SalaryRow>("total");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: keyof SalaryRow) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortHeader = (label: string, field: keyof SalaryRow) => (
    <Button
      className="cursor-pointer"
      variant="ghost"
      onClick={() => toggleSort(field)}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  const sortedSalaries = useMemo(() => {
    return [...salaries].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" || typeof bVal === "string") {
        const cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""));
        return sortDir === "asc" ? cmp : -cmp;
      }
      const an = Number(aVal ?? 0);
      const bn = Number(bVal ?? 0);
      return sortDir === "asc" ? an - bn : bn - an;
    });
  }, [salaries, sortKey, sortDir]);

  // Отслеживаем, редактирует ли админ поле аванса прямо сейчас, чтобы
  // фоновое авто-обновление не перетирало недописанное значение.
  const editingSalaryId = useRef<number | null>(null);

  const refresh = useCallback(
    async (m: number, y: number, opts?: { silent?: boolean }) => {
      if (opts?.silent) setRefreshing(true);
      try {
        // Первый проход — считаем доход/фонд (нужен generateSalaries).
        await generateGuildFunds(m, y);
        try {
          await generateSalaries(m, y);
        } catch {
          // Нет допущенных пользователей за месяц (например, ещё нет данных) —
          // фонд всё равно должен отобразиться.
        }
        // Второй проход — пересчитываем "В казне" с учётом реального аванса
        // по игрокам (Salary.sentAmount), который появился только что.
        await generateGuildFunds(m, y);
        const [fundResult, salariesResult] = await Promise.all([
          getGuildFunds(m, y),
          getSalariesForMonth(m, y),
        ]);
        setFund(fundResult);
        if (editingSalaryId.current === null) {
          setSalaries(salariesResult);
        }
        setLastUpdated(new Date());
      } finally {
        setRefreshing(false);
        setInitialLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    setInitialLoading(true);
    refresh(month, year);
    const interval = setInterval(
      () => refresh(month, year, { silent: true }),
      AUTO_REFRESH_MS,
    );
    return () => clearInterval(interval);
  }, [month, year, refresh]);

  const handleAdvanceChange = async (
    salaryId: number,
    sentAmount: number,
    sent: boolean,
  ) => {
    setSalaries((prev) =>
      prev.map((s) => (s.id === salaryId ? { ...s, sentAmount, sent } : s)),
    );
    await updateSalaryAdvance(salaryId, sentAmount, sent);
  };

  const totalSalaries = salaries.length
    ? salaries.reduce((sum, s) => sum + s.total, 0)
    : (fund?.salaryBudget ?? 0);
  const liveAdvanceSent = fund?.advanceSent ?? 0;
  const effectiveInTreasury = fund?.inTreasury ?? 0;
  const remainingSalaries = totalSalaries - liveAdvanceSent;
  const freeGold = effectiveInTreasury - remainingSalaries;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">
          Финансы гильдии — {month}/{year}
        </h1>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {refreshing ? (
            <>
              <Loader2 className="animate-spin w-3 h-3" /> обновление…
            </>
          ) : lastUpdated ? (
            `обновлено в ${lastUpdated.toLocaleTimeString("ru-RU")}`
          ) : null}
        </span>
      </div>
      {isAdmin && (
        <div className="flex items-center gap-4">
          <Select
            value={month.toString()}
            onValueChange={(value) => setMonth(+value)}
          >
            <SelectTrigger className="border rounded px-2 py-1 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <SelectItem key={m} value={m.toString()}>
                  {new Date(0, m - 1).toLocaleString("ru-RU", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={year.toString()}
            onValueChange={(value) => setYear(+value)}
          >
            <SelectTrigger className="border rounded px-2 py-1 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => refresh(month, year)}
            variant="outline"
            className="cursor-pointer"
            disabled={refreshing}
            title="Пересчитать сейчас"
          >
            <RefreshCw className={refreshing ? "animate-spin w-4 h-4" : "w-4 h-4"} />
          </Button>
        </div>
      )}

      {initialLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin w-4 h-4" /> Загрузка…
        </div>
      )}

      {fund && (
        <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-muted/30">
          <div>
            💰 Доходы (Продано): <strong>{fund.totalIncome}</strong>
          </div>
          <div>
            📤 Расходы: <strong>{fund.totalExpenses}</strong>
          </div>
          <div>
            🔁 Перенесено с прошлого месяца:{" "}
            <strong>{fund.carryOver ?? 0}</strong>
          </div>
          <div>
            👥 Зарплатный фонд (70%): <strong>{fund.salaryBudget}</strong>
          </div>
          <div>
            🏦 Доход казны (30%): <strong>{fund.treasuryBudget}</strong>
          </div>
          <div>
            💰 Сейчас в казне: <strong>{effectiveInTreasury}</strong>
          </div>
          <div>
            📈 "Свободная" голда в казне: <strong>{freeGold}</strong>
          </div>
          <div>
            🧾 Суммарные З/П за месяц: <strong>{totalSalaries}</strong>
          </div>
          <div>
            📨 Выслано авансом: <strong>{liveAdvanceSent}</strong>
          </div>
          <div>
            ⏳ Оставшиеся З/П на месяц: <strong>{remainingSalaries}</strong>
          </div>
        </div>
      )}

      {salaries.length > 0 && (
        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{sortHeader("Игрок", "username")}</TableHead>
                <TableHead>{sortHeader("Класс", "class")}</TableHead>
                <TableHead>{sortHeader("АГЛ", "aglPercent")}</TableHead>
                <TableHead>{sortHeader("Прайм", "primePercent")}</TableHead>
                <TableHead>{sortHeader("Общий", "totalPercent")}</TableHead>
                <TableHead>{sortHeader("%t (гильдия)", "tenurePercent")}</TableHead>
                <TableHead>{sortHeader("Доп (бонус)", "customBonusPercent")}</TableHead>
                <TableHead>{sortHeader("Штр (штраф)", "penaltyPercent")}</TableHead>
                <TableHead>{sortHeader("%Итог", "weightPercent")}</TableHead>
                <TableHead>{sortHeader("Итого", "total")}</TableHead>
                <TableHead>{sortHeader("Выслано", "sent")}</TableHead>
                <TableHead>{sortHeader("Сумма аванса", "sentAmount")}</TableHead>
                <TableHead>Остаток</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSalaries.map((s) => (
                <TableRow key={s.userId}>
                  <TableCell>{s.username}</TableCell>
                  <TableCell>
                    {s.class ? (
                      <Badge
                        className="text-background gap-1"
                        style={{
                          backgroundColor:
                            classColors[s.class] ?? "rgb(120,120,120)",
                        }}
                      >
                        {classIcons[s.class]}
                        {s.class}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{s.aglPercent.toFixed(2)}%</TableCell>
                  <TableCell>{s.primePercent.toFixed(2)}%</TableCell>
                  <TableCell>{s.totalPercent.toFixed(2)}%</TableCell>
                  <TableCell>{s.tenurePercent.toFixed(2)}%</TableCell>
                  <TableCell>{s.customBonusPercent.toFixed(2)}%</TableCell>
                  <TableCell>{s.penaltyPercent.toFixed(2)}%</TableCell>
                  <TableCell>{s.weightPercent.toFixed(2)}%</TableCell>
                  <TableCell>{s.total}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={s.sent}
                      disabled={!isAdmin}
                      onCheckedChange={(checked) =>
                        handleAdvanceChange(
                          s.id,
                          s.sentAmount,
                          checked === true,
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={s.sentAmount}
                      disabled={!isAdmin}
                      onFocus={() => (editingSalaryId.current = s.id)}
                      onBlur={() => (editingSalaryId.current = null)}
                      onChange={(e) =>
                        handleAdvanceChange(s.id, +e.target.value, s.sent)
                      }
                      className="w-28"
                    />
                  </TableCell>
                  <TableCell>{s.total - s.sentAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
