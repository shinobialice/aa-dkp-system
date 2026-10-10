"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Crown, ShieldCheck, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { Avatar, AvatarImage, AvatarFallback, AvatarFrame } from "@/shared/ui";
import { getOnlineUsers } from "@/actions/getOnlineUsers";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";
import { avatarSrc } from "@/shared/lib/format";

const POLL_INTERVAL_MS = 30 * 1000;

type OnlineUser = {
  id: number;
  username: string;
  avatar_url: string | null;
  avatar_frame_url: string | null;
  role: string | null;
};

const roleIcons: Record<string, ReactNode> = {
  Администратор: (
    <Crown className="size-3.5 shrink-0" color="rgb(215, 100, 168)" />
  ),
  Модератор: (
    <ShieldCheck className="size-3.5 shrink-0" color="rgb(58, 76, 92)" />
  ),
  Секретутка: (
    <Sparkles className="size-3.5 shrink-0" color="rgb(79, 70, 229)" />
  ),
};

function useOnlineUsers() {
  const [users, setUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    getOnlineUsers().then(setUsers);
  }, []);

  useVisiblePolling(() => {
    getOnlineUsers().then(setUsers);
  }, POLL_INTERVAL_MS);

  return users;
}

function AvatarStack({ users }: { users: OnlineUser[] }) {
  return (
    <span className="flex">
      {users.slice(0, 3).map((user, index) => (
        <AvatarFrame
          key={user.id}
          frameUrl={user.avatar_frame_url}
          className={index > 0 ? "-ml-2" : ""}
        >
          <Avatar className="size-6 border-2 border-background">
            <AvatarImage
              src={avatarSrc(user.username, user.avatar_url)}
              alt=""
            />
            <AvatarFallback className="text-2xs">
              {user.username.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </AvatarFrame>
      ))}
    </span>
  );
}

function OnlineMenu({
  users,
  side,
  children,
}: {
  users: OnlineUser[];
  side: "top" | "bottom";
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="end" className="w-62.5">
        <DropdownMenuLabel>Сейчас на сайте: {users.length}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {users.length === 0 && (
          <DropdownMenuItem disabled>Никого нет</DropdownMenuItem>
        )}
        {users.map((u) => (
          <DropdownMenuItem
            key={u.id}
            className="cursor-pointer"
            onSelect={() => router.push(`/profile/${u.id}`)}
          >
            <span className="relative shrink-0">
              <AvatarFrame frameUrl={u.avatar_frame_url}>
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={avatarSrc(u.username, u.avatar_url)}
                    alt={u.username}
                  />
                  <AvatarFallback className="text-2xs">
                    {u.username.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </AvatarFrame>
              <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
            </span>
            <span className="truncate">{u.username}</span>
            {u.role && <span className="ml-auto">{roleIcons[u.role]}</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function OnlineUsersWidget() {
  const users = useOnlineUsers();

  return (
    <OnlineMenu users={users} side="bottom">
      <button
        type="button"
        title={`Сейчас на сайте: ${users.length}`}
        className="flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border bg-muted/50 pr-3 pl-1.5 text-sm transition hover:bg-muted data-[state=open]:bg-muted"
      >
        <AvatarStack users={users} />
        <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
          <span className="size-2 rounded-full bg-green-500" />
          {users.length} онлайн
        </span>
      </button>
    </OnlineMenu>
  );
}

export function OnlineUsersRow() {
  const users = useOnlineUsers();

  return (
    <OnlineMenu users={users} side="top">
      <button
        type="button"
        className="flex min-h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm"
      >
        <span className="mx-[5px] size-2 rounded-full bg-green-500" />
        <span className="flex-1">Онлайн</span>
        <AvatarStack users={users} />
        <span className="text-muted-foreground">{users.length}</span>
      </button>
    </OnlineMenu>
  );
}
