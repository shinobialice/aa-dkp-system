const START_YEAR = 2025;

export function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: currentYear - START_YEAR + 1 },
    (_, i) => START_YEAR + i,
  );
}
