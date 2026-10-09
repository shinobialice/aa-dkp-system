import type { UserSeal } from "@/actions/getUserSeals";
import { Link2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import SealIcon from "@/widgets/profile/seals/SealIcon";
import {
  getSealGradeForLevel,
  getSealGradeLabel,
} from "@/widgets/profile/seals/sealsData";
import { formatJoinedDate } from "@/shared/lib/tenure";

export default function ProfileMeta({
  tenure,
  joinedAt,
  vkHref,
  vkRealName,
  seals,
}: {
  tenure: string | null;
  joinedAt: string | null;
  vkHref: string | null;
  vkRealName: string;
  seals: UserSeal[];
}) {
  return (
    <>
      {joinedAt && (
        <span>
          В гильдии{" "}
          <span className="font-semibold text-foreground">{tenure}</span> · с{" "}
          {formatJoinedDate(joinedAt)}
        </span>
      )}
      {vkHref && (
        <a
          href={vkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-green-700 hover:underline dark:text-green-400"
        >
          <Link2 className="size-3.5" />
          {vkRealName || "ВКонтакте"}
        </a>
      )}
      {seals?.length > 0 && (
        <span className="inline-flex items-center gap-1.5">
          Печати
          {seals.map((seal) => (
            <Tooltip key={seal.id}>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <SealIcon
                    grade={getSealGradeForLevel(seal.level)}
                    size={22}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {seal.seal_name} · уровень {seal.level} (
                {getSealGradeLabel(getSealGradeForLevel(seal.level))})
              </TooltipContent>
            </Tooltip>
          ))}
        </span>
      )}
    </>
  );
}
