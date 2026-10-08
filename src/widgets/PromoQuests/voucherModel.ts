export function amountTone(amount: number, needed: number) {
  if (amount <= needed) return "text-green-700 dark:text-green-400";
  return "text-amber-700 dark:text-amber-400";
}
