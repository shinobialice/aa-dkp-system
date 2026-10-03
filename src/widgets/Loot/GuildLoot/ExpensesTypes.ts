import type { ExpenseRow } from "@/shared/lib/dbTypes";

export type ExpenseItem = Omit<ExpenseRow, "id" | "comment"> & {
  id?: number;
  comment?: string | null;
};
