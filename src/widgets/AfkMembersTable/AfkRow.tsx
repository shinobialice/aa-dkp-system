import Link from "next/link";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { avatarSrc } from "@/shared/lib/format";
import { ClassPill } from "@/widgets/MembersTable/ClassPill";
import { Salary } from "@/widgets/MembersTable/Salary";
import ConfirmAction from "./ConfirmAction";
import {
  ROW_GRID,
  afkDurationLabel,
  awaySince,
  daysLabel,
  tone,
  type AfkMember,
} from "./afkModel";

type Props = {
  member: AfkMember;
  days: number | null;
  maxDays: number;
  onUntag: (member: AfkMember) => Promise<void>;
  onBringBack: (member: AfkMember) => Promise<void>;
};

export default function AfkRow({
  member,
  days,
  maxDays,
  onUntag,
  onBringBack,
}: Props) {
  const since = awaySince(member);
  const color = tone(days);
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-2 border-b px-4 py-3 last:border-b-0 hover:bg-muted/40",
        ROW_GRID,
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <Avatar className="size-8 shrink-0">
          <AvatarImage
            src={avatarSrc(member.username, member.avatar_url)}
            alt=""
          />
          <AvatarFallback className="text-2xs">
            {member.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <Link
            href={`/profile/${member.id}`}
            className="block truncate font-semibold hover:underline"
          >
            {member.username}
          </Link>
          <p className="truncate text-2xs text-muted-foreground">
            {member.vk_name && `${member.vk_name} · `}в гильдии{" "}
            {daysLabel(member.daysInGuild)}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {member.isInactive && (
              <span className="rounded-full bg-red-100 px-2 py-px text-2xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
                Ушёл из гильдии
              </span>
            )}
            {member.isAfkTagged && (
              <span className="rounded-full bg-zinc-100 px-2 py-px text-2xs font-semibold text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                Тег АФК
              </span>
            )}
          </div>
        </div>
      </div>

      <span className="hidden lg:block">
        <ClassPill cls={member.class} />
      </span>
      <span className="hidden text-right tabular-nums lg:block">
        {member.class_gear_score?.toLocaleString("ru-RU") ?? "—"}
      </span>

      <div className="col-span-2 row-start-2 lg:col-span-1 lg:row-start-auto">
        <span className={cn("font-semibold tabular-nums", color.text)}>
          {afkDurationLabel(days)}
        </span>
        {since !== null && (
          <span className="ml-1.5 text-2xs text-muted-foreground">
            с {new Date(since).toLocaleDateString("ru-RU")}
          </span>
        )}
        <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted">
          <span
            className={cn("block h-full rounded-full", color.bar)}
            style={{ width: `${((days ?? 0) / maxDays) * 100}%` }}
          />
        </span>
      </div>

      <div className="col-start-2 row-start-1 flex justify-end lg:col-start-auto lg:row-start-auto">
        <Salary member={member} />
      </div>

      <div className="col-span-2 flex flex-wrap gap-1.5 lg:col-span-1 lg:justify-end">
        {member.isAfkTagged && member.afkTagId != null && (
          <ConfirmAction
            label="Снять АФК"
            question="Снять?"
            onConfirm={() => onUntag(member)}
          />
        )}
        {member.isInactive && (
          <ConfirmAction
            label="Вернуть в гильдию"
            question="Вернуть?"
            onConfirm={() => onBringBack(member)}
          />
        )}
      </div>
    </div>
  );
}
