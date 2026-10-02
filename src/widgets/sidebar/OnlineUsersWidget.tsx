"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Users, Crown, ShieldCheck, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { SidebarMenuButton, SidebarMenuItem } from "@/shared/ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui";
import { getOnlineUsers } from "@/actions/getOnlineUsers";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";

const POLL_INTERVAL_MS = 30 * 1000;

type OnlineUser = {
  id: number;
  username: string;
  avatar_url: string | null;
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

function avatarSrc(user: OnlineUser) {
  return (
    user.avatar_url ??
    `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`
  );
}

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
        <Avatar
          key={user.id}
          className={`size-6 border-2 border-sidebar ${index > 0 ? "-ml-2" : ""}`}
        >
          <AvatarImage src={avatarSrc(user)} alt="" />
          <AvatarFallback className="text-[9px]">
            {user.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
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
  side: "top" | "right";
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} className="w-[250px]">
        <DropdownMenuLabel>Сейчас на сайте: {users.length}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {users.length === 0 && <DropdownMenuItem disabled>Никого нет</DropdownMenuItem>}
        {users.map((u) => (
          <DropdownMenuItem
            key={u.id}
            className="cursor-pointer"
            onSelect={() => router.push(`/profile/${u.id}`)}
          >
            <span className="relative shrink-0">
              <Avatar className="h-6 w-6">
                <AvatarImage src={avatarSrc(u)} alt={u.username} />
                <AvatarFallback className="text-[10px]">
                  {u.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
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
    <SidebarMenuItem>
      <OnlineMenu users={users} side="top">
        <SidebarMenuButton className="cursor-pointer" tooltip={`Онлайн: ${users.length}`}>
          <Users />
          <span className="flex-1">Онлайн</span>
          <AvatarStack users={users} />
          <span className="min-w-4 text-right text-xs text-muted-foreground">
            {users.length}
          </span>
        </SidebarMenuButton>
      </OnlineMenu>
    </SidebarMenuItem>
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
