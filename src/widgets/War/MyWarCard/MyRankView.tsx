import Image from "next/image";
import { formatNumber, plural } from "@/shared/lib/format";
import { formatDecimal, type Fighter } from "../warModel";
import MyStatGrid from "./MyStatGrid";
import { rankProgress } from "./myWarModel";

type Props = {
  me: Fighter;
  fighters: Fighter[];
  totalRaids: number;
};

export default function MyRankView({ me, fighters, totalRaids }: Props) {
  const { current, next, place, rankedCount, left, share } = rankProgress(
    me,
    fighters,
  );
  const kills = me.kills ?? 0;
  const raids = me.raids ?? 0;
  const stats = [
    { label: "Киллов", value: formatNumber(kills, 0) },
    { label: "Хонора", value: formatNumber(me.honor ?? 0, 0) },
    { label: "Рейдов", value: `${formatDecimal(raids)}/${totalRaids}` },
    {
      label: "Киллов за рейд",
      value: raids ? formatDecimal(kills / raids) : "—",
    },
  ];

  return (
    <>
      <div className="relative grid h-[170px] place-items-center">
        <span
          aria-hidden
          className="arena-rays absolute size-[170px] rounded-full [--ray:rgb(34_197_94/0.22)]"
        />
        <span className="arena-float relative">
          <Image
            src={current.icon}
            alt={current.name}
            width={140}
            height={140}
            className="arena-pop size-35 object-contain drop-shadow-[0_10px_18px_rgb(0_0_0/0.5)]"
          />
        </span>
      </div>
      <div className="-mt-2 text-center">
        <p className="font-display text-[22px] tracking-wide uppercase">
          {current.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {place}-е место по киллам из {rankedCount}
        </p>
      </div>
      {next && (
        <div className="flex flex-col gap-1.5">
          <p className="flex justify-between gap-2 text-xs text-muted-foreground">
            до «{next.name}»
            <b className="text-green-700 dark:text-green-400">
              ещё {left} {plural(left, "килл", "килла", "киллов")}
            </b>
          </p>
          <span className="block h-2.5 -skew-x-[20deg] overflow-hidden bg-muted">
            <span
              className="arena-grow-x block h-full bg-gradient-to-r from-green-500 to-green-300"
              style={{ width: `${share * 100}%` }}
            />
          </span>
        </div>
      )}
      <MyStatGrid stats={stats} />
    </>
  );
}
