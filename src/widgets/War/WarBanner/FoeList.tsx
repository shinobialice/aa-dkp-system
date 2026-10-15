import { cn } from "@/shared/lib/tw-merge";
import type { OpponentView } from "../opponentsModel";
import { formatDayMonth } from "../warModel";
import { foeNote, liveClock, monogram } from "./bannerModel";

const FIRST_DELAY_S = 0.15;
const STEP_DELAY_S = 0.12;

type Props = {
  opponents: OpponentView[];
  now: number | null;
};

export default function FoeList({ opponents, now }: Props) {
  if (opponents.length === 0) {
    return (
      <p className="text-sm text-white/70 md:text-right">Противник не указан</p>
    );
  }

  const isMulti = opponents.length > 1;
  return (
    <ul className="flex min-w-0 flex-col">
      {opponents.map((opponent, index) => (
        <li
          key={opponent.key}
          className={cn(
            "arena-from-right flex min-w-0 items-center gap-4 py-2.5 md:flex-row-reverse md:text-right",
            index > 0 && "border-t border-white/15",
            opponent.status === "ended" && "opacity-50",
          )}
          style={{ animationDelay: `${FIRST_DELAY_S + index * STEP_DELAY_S}s` }}
        >
          <FoeCrest name={opponent.name} isSmall={isMulti} />
          <div className="min-w-0">
            {!isMulti && (
              <p className="text-2xs tracking-[0.12em] text-white/60 uppercase">
                Против
              </p>
            )}
            <p
              className={cn(
                "-skew-x-8 font-display leading-[0.95] break-words text-[#ff8a8a] uppercase [text-shadow:0_4px_0_rgb(0_0_0/0.3)]",
                isMulti
                  ? "text-[clamp(22px,3vw,36px)]"
                  : "text-[clamp(30px,5.4vw,60px)]",
                opponent.status === "ended" && "line-through decoration-[3px]",
              )}
            >
              {opponent.name}
            </p>
            <FoeTime opponent={opponent} now={now} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function FoeCrest({ name, isSmall }: { name: string; isSmall: boolean }) {
  return (
    <div
      className={cn(
        "relative shrink-0",
        isSmall ? "h-16 w-14" : "h-[72px] w-16 md:h-[104px] md:w-[92px]",
      )}
    >
      <div className="arena-shield absolute inset-0 bg-[linear-gradient(155deg,#ffc9c9,#b3302c_45%,#ff9b9b_62%,#6e1515)]" />
      <div
        className={cn(
          "arena-shield absolute inset-[3px] grid place-items-center bg-[radial-gradient(circle_at_50%_35%,#7f1d1d,#1d0b0d)] font-display text-[#ffd0d0]",
          isSmall ? "pb-2 text-lg" : "pb-3 text-xl md:text-3xl",
        )}
      >
        {monogram(name)}
      </div>
    </div>
  );
}

function FoeTime({
  opponent,
  now,
}: {
  opponent: OpponentView;
  now: number | null;
}) {
  if (opponent.status === "active" && opponent.startedAt && now !== null) {
    const clock = liveClock(opponent.startedAt, now);
    return (
      <p className="mt-1.5 text-xs text-white/70">
        <b className="font-display text-sm font-normal text-white">
          {clock.days} {clock.time}
        </b>{" "}
        · с {formatDayMonth(opponent.startedAt)}
      </p>
    );
  }
  const note = foeNote(opponent);
  if (!note) return null;
  return <p className="mt-1.5 text-xs text-white/70">{note}</p>;
}
