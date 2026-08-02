"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
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
  const router = useRouter();

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-pointer"
          onClick={() => router.push(`/profile/${user.id}`)}
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
          </div>
        </SidebarMenuButton>
        <SidebarMenuAction
          className="cursor-pointer !top-1/2 -translate-y-1/2"
          onClick={logout}
          title="Выйти"
        >
          <LogOut />
        </SidebarMenuAction>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
