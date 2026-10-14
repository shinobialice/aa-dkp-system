import { cn } from "@/shared/lib/tw-merge";
import { pointsLabel, pointsTier, type PointsTier } from "./promoQuestsModel";

type Props = {
  points: number;
};

const GEM_CLASS: Record<PointsTier, string> = {
  common: "from-zinc-300 to-zinc-500 dark:from-zinc-400 dark:to-zinc-600",
  rare: "from-sky-300 to-blue-600",
  epic: "from-fuchsia-400 to-violet-700",
  legendary: "promo-shine from-amber-200 via-amber-400 to-orange-600",
};

export default function PointsGem({ points }: Props) {
  return (
    <span
      title={pointsLabel(points)}
      className="relative grid size-9 shrink-0 place-items-center"
    >
      <span
        className={cn(
          "absolute inset-1.5 rotate-45 overflow-hidden rounded-[5px] bg-gradient-to-br shadow-md ring-1 ring-white/40 ring-inset",
          GEM_CLASS[pointsTier(points)],
        )}
      />
      <span className="relative text-sm font-bold text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.45)]">
        {points}
      </span>
    </span>
  );
}
