export default function KillBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  return (
    <span className="block h-2 overflow-hidden rounded bg-muted">
      <span
        className="block h-full rounded bg-red-500"
        style={{ width: `${max > 0 ? (Math.max(0, value) / max) * 100 : 0}%` }}
      />
    </span>
  );
}
