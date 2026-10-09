"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarFrame, AvatarImage } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui";
import useCurrentUser from "@/hooks/useCurrentUser";
import { logout } from "@/actions/logout";

export function NavUser() {
  const user = useCurrentUser();

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild tooltip={user.name}>
          <Link href={`/profile/${user.id}`}>
            <AvatarFrame
              frameUrl={user.frame}
              className="group-data-[collapsible=icon]:[&>img]:hidden"
            >
              <Avatar
                className={cn(
                  "h-8 w-8",
                  user.frame ? "rounded-full" : "rounded-lg",
                )}
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback
                  className={user.frame ? "rounded-full" : "rounded-lg"}
                >
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
            </AvatarFrame>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
            </div>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuAction
          className="cursor-pointer !top-1/2 -translate-y-1/2"
          onClick={() => logout()}
          title="Выйти"
          aria-label="Выйти"
        >
          <LogOut />
        </SidebarMenuAction>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
