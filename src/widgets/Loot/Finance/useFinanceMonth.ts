"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  getGuildFunds,
  getSalariesForMonth,
  updateSalaryAdvance,
} from "@/actions/financeActions";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";
import type { Fund, SalaryEntry } from "./financeModel";

const AUTO_REFRESH_MS = 30_000;

type Loaded = {
  key: string;
  fund: Fund | null;
  salaries: SalaryEntry[];
  updatedAt: Date;
};

export function useFinanceMonth(month: number, year: number) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const editingSalaryId = useRef<number | null>(null);
  const key = `${year}-${month}`;

  const refresh = async () => {
    const [fund, salaries] = await Promise.all([
      getGuildFunds(month, year),
      getSalariesForMonth(month, year),
    ]);
    setLoaded((previous) => {
      const keepEdited =
        editingSalaryId.current !== null && previous?.key === key;
      return {
        key,
        fund,
        salaries: keepEdited ? previous.salaries : salaries,
        updatedAt: new Date(),
      };
    });
  };

  const loadMonth = useEffectEvent(() => {
    refresh();
  });

  useEffect(() => {
    loadMonth();
  }, [key]);

  useVisiblePolling(refresh, AUTO_REFRESH_MS);

  const changeAdvance = async (
    salaryId: number,
    sentAmount: number,
    sent: boolean,
  ) => {
    setLoaded(
      (previous) =>
        previous && {
          ...previous,
          salaries: previous.salaries.map((row) =>
            row.id === salaryId ? { ...row, sentAmount, sent } : row,
          ),
        },
    );
    await updateSalaryAdvance(salaryId, sentAmount, sent);
  };

  const isLoaded = loaded?.key === key;

  return {
    isLoaded,
    fund: isLoaded ? loaded.fund : null,
    salaries: isLoaded ? loaded.salaries : [],
    updatedAt: loaded?.updatedAt ?? null,
    refresh,
    changeAdvance,
    startEditing: (salaryId: number) => {
      editingSalaryId.current = salaryId;
    },
    stopEditing: () => {
      editingSalaryId.current = null;
    },
  };
}
