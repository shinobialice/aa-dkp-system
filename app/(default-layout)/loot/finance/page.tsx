"use client";

import { useState, useEffect } from "react";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  generateSalaries,
  getGuildFunds,
  getSalariesForMonth,
} from "@/src/actions/financeActions";
import { generateGuildFunds } from "@/src/actions/generateGuildFunds";
import useUserTag  from "@/src/hooks/useUserTag";

export default function FinancePage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [loadingFund, setLoadingFund] = useState(false);
  const [loadingSalaries, setLoadingSalaries] = useState(false);
  const isAdmin = useUserTag("Администратор");

  const [fund, setFund] = useState<null | {
    totalIncome: number;
    totalExpenses: number;
    profit: number;
    salaryBudget: number;
    treasuryLeft: number;
  }>(null);

  const [salaries, setSalaries] = useState<
    {
      userId: number;
      username: string;
      amount: number;
      bonus: number | null;
      total: number;
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
          <select
            value={month}
            onChange={(e) => setMonth(+e.target.value)}
            className="border rounded px-2 py-1"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("ru-RU", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(+e.target.value)}
            className="border rounded px-2 py-1"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
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
            💰 Доходы: <strong>{fund.totalIncome}</strong>
          </div>
          <div>
            📤 Расходы: <strong>{fund.totalExpenses}</strong>
          </div>
          <div>
            📈 Прибыль: <strong>{fund.profit}</strong>
          </div>
          <div>
            👥 Зарплатный фонд (70%): <strong>{fund.salaryBudget}</strong>
          </div>
          <div>
            🏦 Казна (30%): <strong>{fund.treasuryLeft}</strong>
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
                <TableHead>Бонус</TableHead>
                <TableHead>Итого</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaries.map((s) => (
                <TableRow key={s.userId}>
                  <TableCell>{s.username}</TableCell>
                  <TableCell>{s.amount}</TableCell>
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
