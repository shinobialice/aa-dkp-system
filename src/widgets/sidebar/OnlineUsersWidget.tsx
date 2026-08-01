"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
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

type OnlineUser = { id: number; username: string };

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
                {u.username}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
