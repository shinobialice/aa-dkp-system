import {
  formatDuration,
  formatSpawnDate,
  type LeviathanState,
} from "./leviathanModel";

type Props = {
  state: LeviathanState | null;
  now: number | null;
};

export default function LeviathanStatus({ state, now }: Props) {
  if (state === null || now === null) {
    return <div className="h-11" aria-hidden />;
  }

  if (state.phase === "waiting") {
    return (
      <div className="flex flex-col gap-0.5 text-sm">
        <span className="font-medium">
          Следующий выход: {formatSpawnDate(state.nextSpawnAt)}
        </span>
        <span className="text-muted-foreground">
          через {formatDuration(state.nextSpawnAt - now)}
        </span>
      </div>
    );
  }

  const { lap, lapPercent } = state.position;
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="font-medium text-amber-700 dark:text-amber-400">
          Левиафан плывёт · круг {lap}, {lapPercent}% пути
        </span>
        <span className="text-muted-foreground">
          с выхода прошло {formatDuration(state.elapsedMs)}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-amber-500"
          style={{ width: `${lapPercent}%` }}
        />
      </div>
    </div>
  );
}
