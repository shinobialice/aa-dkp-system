import Image from "next/image";

const TARGET_USERNAME = "Mnrqw";
const KILLS = 1380;
const NEXT_RANK_KILLS = 2000;
const AVG_KILLS = 67;
const AVG_HONOR = 812;

export default function RankProgress({ username }: { username: string }) {
  if (username !== TARGET_USERNAME) return null;

  const percent = Math.min(100, (KILLS / NEXT_RANK_KILLS) * 100);

  return (
    <div className="mt-3 w-fit max-w-[340px] space-y-2.5 rounded-lg border p-3">
      <div className="flex items-center gap-2.5">
        <Image
          src="/images/ranks/140px-SeasonalRank4-3.png"
          alt="Ранг 4-3"
          width={64}
          height={64}
          className="shrink-0"
        />
        <span className="text-base font-semibold">Ранг 4-3</span>
      </div>
      <div className="space-y-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {KILLS.toLocaleString("ru-RU")} /{" "}
          {NEXT_RANK_KILLS.toLocaleString("ru-RU")} килов до следующего ранга
        </div>
      </div>
      <div className="flex gap-4 text-xs">
        <div>
          <div className="text-muted-foreground">Ср. киллов</div>
          <div className="font-semibold">{AVG_KILLS}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Ср. хонор</div>
          <div className="font-semibold">{AVG_HONOR}</div>
        </div>
      </div>
    </div>
  );
}
