import { percent } from "../attendanceModel";

type Props = {
  attendees: number;
  total: number;
  dkp: number;
  late: number;
};

export default function RaidStats({ attendees, total, dkp, late }: Props) {
  return (
    <div className="mx-5 grid grid-cols-3 divide-x rounded-lg border">
      <div className="flex flex-col px-3 py-2">
        <span className="text-xs text-muted-foreground">Участники</span>
        <span className="text-base font-bold tabular-nums">
          {attendees}
          {total > 0 && (
            <>
              {" "}
              из {total}{" "}
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                {percent(attendees, total)}%
              </span>
            </>
          )}
        </span>
      </div>
      <div className="flex flex-col px-3 py-2">
        <span className="text-xs text-muted-foreground">Ценность</span>
        <span className="text-base font-bold tabular-nums">{dkp}</span>
      </div>
      <div className="flex flex-col px-3 py-2">
        <span className="text-xs text-muted-foreground">Опоздали</span>
        <span className="text-base font-bold tabular-nums">{late}</span>
      </div>
    </div>
  );
}
