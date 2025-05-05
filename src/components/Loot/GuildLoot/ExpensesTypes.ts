export type ExpenseItem = {
  id?: number;
  date: string | Date;
  amount: number;
  target: string;
  source: string;
  comment?: string | null;
};
