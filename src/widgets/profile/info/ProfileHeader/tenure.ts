import { differenceInMonths } from "date-fns";

export function formatTenure(joinedAt: string | null): string | null {
  if (!joinedAt) return null;
  const months = differenceInMonths(new Date(), new Date(joinedAt));
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0 && rest === 0) return "меньше месяца";
  return [years ? `${years} г.` : null, rest ? `${rest} мес.` : null]
    .filter(Boolean)
    .join(" ");
}

export function formatJoinedDate(joinedAt: string): string {
  const [year, month, day] = joinedAt.slice(0, 10).split("-");
  return `${day}.${month}.${year}`;
}
