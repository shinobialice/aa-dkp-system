"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { PromoLink } from "@/shared/config/promoPages";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui";

type Props = {
  promo: PromoLink;
};

export default function PromoMenuItem({ promo }: Props) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(promo.url);

  return (
    <SidebarGroup className="py-1">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={promo.title}
              className="rainbow-surface font-semibold"
            >
              <Link
                href={promo.url}
                aria-current={isActive ? "page" : undefined}
              >
                <Sparkles className="text-fuchsia-500" />
                <span className="rainbow-text">{promo.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
