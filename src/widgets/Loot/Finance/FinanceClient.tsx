"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui";
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
import {
  generateSalaries,
  getGuildFunds,
  getSalariesForMonth,
} from "@/actions/financeActions";
import { generateGuildFunds } from "@/actions/generateGuildFunds";

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
  const [loadingFund, setLoadingFund] = useState(false);
  const [loadingSalaries, setLoadingSalaries] = useState(false);

  const [fund, setFund] = useState<null | {
    totalIncome: number;
    totalExpenses: number;
    profit: number;
    salaryBudget: number;
    treasuryBudget: number;
    inTreasury: number;
  }>(null);

  const [salaries, setSalaries] = useState<
    {
      userId: number;
      username: string;
      amount: number;
      bonus: number | null;
      total: number;
      bonusPercent: number;
    }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      const result = await getGuildFunds(month, year);
      setFund(result);
      const sal = await getSalariesForMonth(month, year);
      setSalaries(sal);
    };
    load();
  }, [month, year]);

  const handleGenerateFund = async () => {
    await generateGuildFunds(month, year);
    const updated = await getGuildFunds(month, year);
    setFund(updated);
  };

  const handleGenerateSalaries = async () => {
    await generateSalaries(month, year);
    const updated = await getSalariesForMonth(month, year);
    setSalaries(updated);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Финансы гильдии — {month}/{year}
      </h1>
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
            onClick={async () => {
              setLoadingFund(true);
              try {
                await handleGenerateFund();
              } finally {
                setLoadingFund(false);
              }
            }}
            className="cursor-pointer"
            disabled={loadingFund}
          >
            {loadingFund ? (
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            ) : (
              "Сгенерировать фонд"
            )}
          </Button>

          <Button
            onClick={async () => {
              setLoadingSalaries(true);
              try {
                await handleGenerateSalaries();
              } finally {
                setLoadingSalaries(false);
              }
            }}
            disabled={!fund || loadingSalaries}
            className={
              !fund || loadingSalaries
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }
          >
            {loadingSalaries ? (
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            ) : (
              "Распределить зарплаты"
            )}
          </Button>
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
            👥 Зарплатный фонд (70%): <strong>{fund.salaryBudget}</strong>
          </div>
          <div>
            🏦 Казна (30%): <strong>{fund.treasuryBudget}</strong>
          </div>
          <div>
            💰 В казне: <strong>{fund.inTreasury}</strong>
          </div>
          <div>
            📈 "Свободная" голда в казне:{" "}
            <strong>{fund.inTreasury - fund.salaryBudget}</strong>
          </div>
        </div>
      )}

      {salaries.length > 0 && (
        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Игрок</TableHead>
                <TableHead>Базовая сумма</TableHead>
                <TableHead>Бонус %</TableHead>
                <TableHead>Бонус</TableHead>
                <TableHead>Итого</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaries.map((s) => (
                <TableRow key={s.userId}>
                  <TableCell>{s.username}</TableCell>
                  <TableCell>{s.amount}</TableCell>
                  <TableCell>{s.bonusPercent ?? 0}%</TableCell>{" "}
                  <TableCell>{s.bonus ?? 0}</TableCell>
                  <TableCell>{s.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
