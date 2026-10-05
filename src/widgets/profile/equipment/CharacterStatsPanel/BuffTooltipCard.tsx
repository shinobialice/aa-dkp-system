import Image from "next/image";
import { highlightNumbers } from "../highlightNumbers";
import { BONUS_COLOR } from "../statColors";

type Props = {
  icon: string;
  title: string;
  description: string;
};

export default function BuffTooltipCard({ icon, title, description }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative size-8 shrink-0 overflow-hidden rounded-md">
          <Image
            unoptimized
            src={icon}
            alt={title}
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="text-2xs text-muted-foreground">Эффект</div>
          <div
            className="truncate text-sm font-semibold"
            style={{ color: BONUS_COLOR }}
          >
            {title}
          </div>
        </div>
      </div>

      <div className="border-t border-border" />

      <div className="space-y-0.5 text-xs text-muted-foreground">
        {description.split("\n").map((line, i) => (
          <div key={i}>{highlightNumbers(line)}</div>
        ))}
      </div>
    </div>
  );
}
