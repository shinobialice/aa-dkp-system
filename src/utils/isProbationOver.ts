export default function isProbationOver(
  joinedAt: string | Date | null,
  asOf: Date = new Date(),
): boolean {
  if (!joinedAt) return false;

  const now = asOf;
  const joined = new Date(joinedAt);
  const day = joined.getDate();
  const monthsPassed =
    now.getFullYear() * 12 +
    now.getMonth() -
    (joined.getFullYear() * 12 + joined.getMonth());

  return (day <= 20 && monthsPassed >= 1) || (day > 20 && monthsPassed >= 2);
}
