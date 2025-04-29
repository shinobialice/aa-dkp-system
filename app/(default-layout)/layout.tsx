"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/src/components/sidebar";
import { ThemeProvider } from "@/src/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="flex min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <main className="flex-1 p-8">{children}</main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
