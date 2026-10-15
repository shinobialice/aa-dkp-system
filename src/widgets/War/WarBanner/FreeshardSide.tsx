import Image from "next/image";
import {
  FACTION_ICON,
  FACTION_LABEL,
  type GuildFaction,
} from "@/shared/config/guildStatus";

type Props = {
  faction: GuildFaction;
};

export default function FreeshardSide({ faction }: Props) {
  return (
    <div className="arena-from-right flex min-w-0 items-center gap-4 md:flex-row-reverse md:text-right">
      <div className="relative h-[72px] w-16 shrink-0 md:h-[104px] md:w-[92px]">
        <div className="arena-shield absolute inset-0 bg-[linear-gradient(155deg,#e0f2fe,#0284c7_45%,#7dd3fc_62%,#0c4a6e)]" />
        <div className="arena-shield absolute inset-[3px] grid place-items-center bg-[radial-gradient(circle_at_50%_35%,#075985,#0a1a24)] pb-3">
          <Image
            src={FACTION_ICON[faction]}
            alt={FACTION_LABEL[faction]}
            width={56}
            height={56}
            className="size-10 object-contain md:size-14"
          />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-2xs tracking-[0.12em] text-white/60 uppercase">
          Режим
        </p>
        <p className="-skew-x-8 font-display text-[clamp(30px,5.4vw,60px)] leading-[0.95] text-sky-300 uppercase [text-shadow:0_4px_0_rgb(0_0_0/0.3)]">
          Фришка
        </p>
        <p className="mt-1.5 text-xs text-white/70">фарм и экономика гильдии</p>
      </div>
    </div>
  );
}
