"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { getOnlineUsers } from "@/actions/getOnlineUsers";

const POLL_INTERVAL_MS = 30 * 1000;

type OnlineUser = { id: number; username: string; role: string | null };

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
  const [users, setUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    const load = () => {
      getOnlineUsers().then(setUsers);
    };
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

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
            <DropdownMenuItem key={u.id} className="cursor-pointer" asChild>
              <Link href={`/profile/${u.id}`}>
                <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
                <span className="truncate">{u.username}</span>
                {u.role && <span className="ml-auto">{roleIcons[u.role]}</span>}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
