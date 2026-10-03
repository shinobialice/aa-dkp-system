export default function StatBar({
  value,
  color,
  borderColor,
}: {
  value: number;
  color: string;
  borderColor: string;
}) {
  return (
    <div
      className="relative flex h-5 w-full items-center justify-center overflow-hidden rounded-xs text-2xs font-semibold text-white"
      style={{
        background: `linear-gradient(to bottom, color-mix(in srgb, ${color} 65%, white 35%), ${color})`,
        border: `1px solid ${borderColor}`,
      }}
    >
      <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
        {Math.round(value).toLocaleString("ru-RU")} (100%)
      </span>
    </div>
  );
}
