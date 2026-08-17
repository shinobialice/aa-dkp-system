"use client";

import { useEffect, useState } from "react";
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

const roleIcons: Record<string, React.ReactNode> = {
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

export function OnlineUsersWidget() {
  const router = useRouter();
  const [users, setUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    getOnlineUsers().then(setUsers);
  }, []);

  useVisiblePolling(() => {
    getOnlineUsers().then(setUsers);
  }, POLL_INTERVAL_MS);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="cursor-pointer">
            <Users className="h-5 w-5" />
            <span>Онлайн</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {users.length}
            </span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" className="w-[250px]">
          <DropdownMenuLabel>
            Сейчас на сайте: {users.length}
          </DropdownMenuLabel>
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
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={
                      u.avatar_url ??
                      `https://api.dicebear.com/6.x/initials/svg?seed=${u.username}`
                    }
                    alt={u.username}
                  />
                  <AvatarFallback className="text-[10px]">
                    {u.username.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
              </span>
              <span className="truncate">{u.username}</span>
              {u.role && <span className="ml-auto">{roleIcons[u.role]}</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
