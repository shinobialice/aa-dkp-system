export function StatusBadge({ status }: { status: string }) {
  if (status === "пропуск") {
    return <span className="text-red-600 font-semibold">Пропускает</span>;
  }
  if (status === "позже") {
    return <span className="text-yellow-600 font-semibold">Позже</span>;
  }
  return null;
}
