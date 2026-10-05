import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import StatDiff from "../StatDiff";

type Props = {
  label: string;
  value: number;
  viewerValue: number | undefined;
  color: string;
  borderColor: string;
};

export default function StatBar({
  label,
  value,
  viewerValue,
  color,
  borderColor,
}: Props) {
  const bar = (
    <div
      className="relative flex h-5 w-full items-center justify-center overflow-hidden rounded-xs text-2xs font-semibold text-white"
      style={{
        background: `linear-gradient(to bottom, color-mix(in srgb, ${color} 65%, white 35%), ${color})`,
        border: `1px solid ${borderColor}`,
      }}
    >
      <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
        {formatAmount(value)} (100%)
      </span>
    </div>
  );

  if (viewerValue === undefined) return bar;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{bar}</TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-1.5">
        {label} у вас: {formatAmount(viewerValue)}
        <StatDiff
          label={label}
          viewer={viewerValue}
          owner={value}
          decimals={0}
        />
      </TooltipContent>
    </Tooltip>
  );
}

function formatAmount(value: number) {
  return Math.round(value).toLocaleString("ru-RU");
}
