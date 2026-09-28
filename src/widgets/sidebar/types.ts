import { LucideIcon } from "lucide-react";

interface BaseSidebarItem {
  title: string;
  isVisible: boolean;
  icon?: LucideIcon;
}

interface LinkSidebarItem extends BaseSidebarItem {
  url: string;
  items?: never;
}

interface GroupSidebarItem extends BaseSidebarItem {
  url?: never;
  items: SidebarItem[];
}

export type SidebarItem = LinkSidebarItem | GroupSidebarItem;
