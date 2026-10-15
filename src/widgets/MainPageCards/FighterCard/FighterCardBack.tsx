import type { MyFighterCard } from "@/actions/getMyFighterCard";
import {
  backMeters,
  backRows,
  monthName,
  percentText,
} from "./fighterCardModel";

type Props = {
  card: MyFighterCard;
  now: number | null;
};

export default function FighterCardBack({ card, now }: Props) {
  return (
    <div className="arena-card-face arena-card-back arena-card-shape arena-rim absolute inset-0">
      <div className="arena-card-shape absolute inset-1 flex flex-col gap-2.5 overflow-hidden bg-[linear-gradient(170deg,#0f3b26,#08160f_70%)] px-[18px] pt-[18px] text-left text-white">
        <span className="font-display text-base tracking-wide uppercase">
          {monthName(now)}
        </span>
        {backMeters(card).map((meter) => (
          <span
            key={meter.label}
            className="grid grid-cols-[52px_minmax(0,1fr)_38px] items-center gap-2 text-xs"
          >
            {meter.label}
            <span className="h-1.5 -skew-x-[20deg] overflow-hidden bg-white/12">
              <span
                className="block h-full bg-gradient-to-r from-green-500 to-green-300"
                style={{ width: `${Math.min(100, meter.percent)}%` }}
              />
            </span>
            <span className="text-right font-display">
              {percentText(meter.percent)}
            </span>
          </span>
        ))}
        {backRows(card).map((row) => (
          <span
            key={row.label}
            className="flex justify-between gap-2 border-t border-white/12 pt-2 text-xs text-white/75"
          >
            {row.label}
            <span className="font-display text-white">{row.value}</span>
          </span>
        ))}
        <LootQueues queues={card.queues} />
        <span className="arena-holo pointer-events-none absolute inset-0 z-[4]" />
      </div>
    </div>
  );
}

function LootQueues({ queues }: { queues: MyFighterCard["queues"] }) {
  if (queues.length === 0) {
    return (
      <span className="border-t border-white/12 pt-2 text-xs text-white/60">
        В очередях лута вас нет
      </span>
    );
  }
  return (
    <span className="flex flex-col gap-1 border-t border-white/12 pt-2 text-xs text-white/80">
      {queues.map((queue) => (
        <span key={queue.id} className="flex justify-between gap-2">
          <span className="truncate">{queue.itemName}</span>
          <span className="shrink-0 font-semibold text-green-300">
            место {queue.place} из {queue.total}
          </span>
        </span>
      ))}
    </span>
  );
}
