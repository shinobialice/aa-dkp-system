"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/src/components/sidebar";
import { ThemeProvider } from "@/src/components/theme-provider";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider defaultOpen={true}>
        <div className="flex bg-background text-foreground w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1">
            <header className="lg:hidden flex h-12 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 h-4" />
              <h1 className="text-base font-medium">Documents</h1>
            </header>
            <main className="flex-1 p-8">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
