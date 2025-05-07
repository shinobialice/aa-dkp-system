"use client";
import FinanceClient from "@/src/components/Loot/Finance/FinanceClient";

export default function FinancePage() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return (
    <FinanceClient currentMonth={currentMonth} currentYear={currentYear} />
  );
}
