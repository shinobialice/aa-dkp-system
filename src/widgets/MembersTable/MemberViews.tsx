"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { classColors, classIcons } from "./classStyles";
import { type Member, vkHref } from "./membersModel";

export const ROW_COLUMNS =
  "grid-cols-[minmax(0,2fr)_104px_64px_108px_96px_96px_96px_88px]";

function formatNumber(value: number) {
  return value.toLocaleString("ru-RU");
}

export function ClassPill({ cls }: { cls: string | null }) {
  if (!cls) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-muted px-2.5 text-xs font-medium whitespace-nowrap">
      <span style={{ color: classColors[cls] }} className="[&_svg]:size-3.5">
        {classIcons[cls]}
      </span>
      {cls}
    </span>
  );
}

function statusTone(value: number) {
  if (value >= 80) {
    return { fill: "bg-green-600", text: "text-green-700 dark:text-green-400" };
  }
  if (value >= 50) {
    return { fill: "bg-amber-500", text: "text-amber-700 dark:text-amber-400" };
  }
  return { fill: "bg-red-500", text: "text-red-700 dark:text-red-400" };
}

export function Meter({
  value,
  status,
  label,
}: {
  value: number | null;
  status?: boolean;
  label?: string;
}) {
  const percent = Math.round(value ?? 0);
  const tone = status ? statusTone(percent) : null;
  return (
    <div className="flex min-w-0 flex-col gap-1">
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span
            className={cn(
              "tabular-nums",
              tone
                ? cn("font-semibold", tone.text)
                : percent === 0 && "text-muted-foreground",
            )}
          >
            {percent}%
          </span>
        </div>
      )}
      <div className={cn("flex items-center gap-2", label && "block")}>
        <span className="relative block h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <span
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              tone ? tone.fill : "bg-zinc-400 dark:bg-zinc-500",
            )}
            style={{ width: `${percent}%` }}
          />
        </span>
        {!label && (
          <span
            className={cn(
              "w-9 text-right text-[13px] tabular-nums",
              tone
                ? cn("font-semibold", tone.text)
                : percent === 0 && "text-muted-foreground",
            )}
          >
            {percent}%
          </span>
        )}
      </div>
    </div>
  );
}

export function Salary({ member }: { member: Member }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-end gap-1 tabular-nums",
        !member.salary && "text-muted-foreground",
      )}
    >
      {member.salary != null ? formatNumber(member.salary) : "—"}
      {member.salaryReason && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Почему такая зарплата"
              className="cursor-help text-muted-foreground"
            >
              <Info className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            {member.salaryReason}
          </TooltipContent>
        </Tooltip>
      )}
    </span>
  );
}

function MemberIdentity({
  member,
  size,
}: {
  member: Member;
  size: "sm" | "lg";
}) {
  const href = vkHref(member);
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar className={cn("shrink-0", size === "sm" ? "size-8" : "size-10")}>
        <AvatarImage
          src={
            member.avatar_url ??
            `https://api.dicebear.com/6.x/initials/svg?seed=${member.username}`
          }
          alt={member.username}
        />
        <AvatarFallback className="text-[11px]">
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
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            {member.vk_real_name ?? "ВК"}
          </a>
        ) : (
          <span className="block text-xs text-muted-foreground">
            ВК не привязан
          </span>
        )}
      </div>
    </div>
  );
}

export function MemberRow({ member }: { member: Member }) {
  return (
    <div
      className={cn(
        "grid min-h-14 items-center gap-3 border-b px-4 py-1.5 last:border-b-0",
        ROW_COLUMNS,
      )}
    >
      <MemberIdentity member={member} size="sm" />
      <div>
        <ClassPill cls={member.class} />
      </div>
      <div className="text-right tabular-nums">
        {member.class_gear_score ? formatNumber(member.class_gear_score) : "—"}
      </div>
      <div>
        <p className="tabular-nums">{formatNumber(member.daysInGuild)} дн.</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          с {member.joinedAtFormatted}
        </p>
      </div>
      <Meter value={member.primePercent} />
      <Meter value={member.aglPercent} />
      <Meter value={member.totalPercent} status />
      <div className="text-right">
        <Salary member={member} />
      </div>
    </div>
  );
}

export function MemberCard({ member }: { member: Member }) {
  return (
    <article className="flex flex-col gap-2.5 rounded-xl border bg-card p-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <MemberIdentity member={member} size="lg" />
        <ClassPill cls={member.class} />
      </div>
      <div className="flex justify-between gap-2 text-xs text-muted-foreground">
        <span>
          GS{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {member.class_gear_score
              ? formatNumber(member.class_gear_score)
              : "—"}
          </span>
        </span>
        <span>
          {formatNumber(member.daysInGuild)} дн. в гильдии · с{" "}
          {member.joinedAtFormatted}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Meter value={member.primePercent} label="Прайм" />
        <Meter value={member.aglPercent} label="АГЛ" />
        <Meter value={member.totalPercent} label="Итого" status />
      </div>
      <div className="flex items-center justify-between border-t pt-2 text-sm">
        <span className="text-muted-foreground">Зарплата</span>
        <span className="font-semibold">
          <Salary member={member} />
        </span>
      </div>
    </article>
  );
}
